import pytest
import asyncio
import os
import sys
import json
from datetime import datetime
from unittest.mock import patch, MagicMock, AsyncMock

# IMPORTANT: Insert helios-ui/Backend first so we get the target OmniCore!
backend_path = os.path.abspath('helios-ui/Backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

dashboard_backend_path = os.path.abspath('Dashboard_Final/Backend')
if dashboard_backend_path not in sys.path:
    sys.path.insert(1, dashboard_backend_path)

# Mock modules that might not be available or should be mocked at import time
sys.modules['Ledger'] = MagicMock()
sys.modules['NexusLogic'] = MagicMock()

import OmniCore

def test_project_auditor():
    auditor = OmniCore.ProjectAuditor(os.path.abspath('helios-ui/Backend'))
    # Use a small cache duration to force a run
    auditor.cache_duration = -1
    f_count, loc_count = auditor.audit()
    assert f_count > 0
    assert loc_count > 0

    # Test caching
    auditor.cache_duration = 300
    auditor.last_run = datetime.now().timestamp()
    f_count2, loc_count2 = auditor.audit()
    assert f_count == f_count2
    assert loc_count == loc_count2

def test_project_matrix_health():
    matrix = OmniCore.ProjectMatrix()

    with patch('requests.head') as mock_head:
        # Mock successful response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_head.return_value = mock_response

        results = matrix.check_health()
        for service, status in results.items():
            assert status == "online"

        # Mock failed response
        mock_response.status_code = 500
        mock_head.return_value = mock_response
        # Force re-check
        matrix.last_check = 0
        results = matrix.check_health()
        for service, status in results.items():
            assert status == "degraded"

        # Mock exception
        mock_head.side_effect = Exception("Connection error")
        matrix.last_check = 0
        results = matrix.check_health()
        for service, status in results.items():
            assert status == "offline"

def test_energy_grid_governor():
    nrg = OmniCore.EnergyGridGovernor("NRG")
    assert nrg.get_max_limit() == 1000.0

    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.json.return_value = {'current': {'shortwave_radiation': 500.0}}
        mock_get.return_value = mock_response

        val = nrg.read_sensor()
        assert val == 500.0

        nrg.run_cycle()
        assert nrg.current_stress == 0.5
        assert nrg.last_action == "OPTIMAL"

        nrg.execute_countermeasure(0.5, override=True)
        assert nrg.last_action == "AGGRESSIVE SELL"

        nrg.execute_countermeasure(0.5, override=False)
        assert nrg.last_action == "DIVERT TO BATTERY"

        # Test error handling
        mock_get.side_effect = Exception("API error")
        nrg.run_cycle()
        assert nrg.current_stress == 0.0

def test_market_risk_governor():
    mkt = OmniCore.MarketRiskGovernor("MKT")
    assert mkt.get_max_limit() == 150000.0

    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.json.return_value = {'price': '100000.0'}
        mock_get.return_value = mock_response

        val = mkt.read_sensor()
        assert val == 100000.0

        mkt.run_cycle()
        assert round(mkt.current_stress, 4) == round(100000.0 / 150000.0, 4)

        mkt.execute_countermeasure(0.5, override=True)
        assert mkt.last_action == "EMERGENCY LIQUIDATION"

        mkt.execute_countermeasure(0.5, override=False)
        assert mkt.last_action == "HEDGING"

def test_bio_health_governor():
    bio = OmniCore.BioHealthGovernor("BIO")
    assert bio.get_max_limit() == 180.0

    with patch('random.random', return_value=0.5):
        val = bio.read_sensor()
        assert val == 75 + (0.5 * 15) # base + 0.5 * 15 + 0 spike

    with patch('random.random', return_value=0.9):
        val = bio.read_sensor()
        assert val == 75 + (0.9 * 15) + 90 # base + 0.9 * 15 + spike

    bio.execute_countermeasure(0.5, override=True)
    assert bio.last_action == "OPTIMIZING COMFORT"

    bio.execute_countermeasure(0.5, override=False)
    assert bio.last_action == "ADRENALINE BLOCK"

@pytest.mark.asyncio
async def test_websocket_handler():
    # Verify we are importing from the correct path
    import inspect
    print(f"Testing OmniCore from: {inspect.getfile(OmniCore)}")
    assert 'helios-ui/Backend/OmniCore.py' in inspect.getfile(OmniCore)

    websocket_mock = AsyncMock()
    websocket_mock.remote_address = "127.0.0.1"

    call_count = [0]
    async def mock_sleep(seconds):
        call_count[0] += 1
        if call_count[0] >= 1:
            raise asyncio.CancelledError()

    with patch('asyncio.sleep', new=mock_sleep), \
         patch('subprocess.check_output', return_value=b'{"cpu_usage": 10.0, "ram_used_gb": 2.0, "entropy": 0.5}'), \
         patch('random.random', return_value=0.5), \
         patch('requests.get') as mock_get:

        # We need mock_get to return values for bio, mkt, nrg inside handler
        mock_response = MagicMock()
        mock_response.json.return_value = {'current': {'shortwave_radiation': 500.0}, 'price': '100000.0'}
        mock_get.return_value = mock_response

        try:
            await OmniCore.handler(websocket_mock)
        except asyncio.CancelledError:
            pass

        websocket_mock.send.assert_called_once()
        sent_data = json.loads(websocket_mock.send.call_args[0][0])

        assert "timestamp" in sent_data
        assert "hardware" in sent_data
        assert "bio" in sent_data
        assert "market" in sent_data
        assert "energy" in sent_data
        assert sent_data["hardware"]["cpu"] == 10.0
