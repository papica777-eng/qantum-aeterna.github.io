// lwas_core/src/omega/reality_map.rs
// IDENTITY: REALITY_MAPPER
// AUTHORITY: AETERNA

use crate::prelude::*;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub is_dir: bool,
    pub children: Vec<FileNode>,
    pub value_eur: f64,
    pub purpose: String,
}

pub struct RealityMapper;

impl RealityMapper {
    /// MAP_SUBSTRATE: Извършва рекурсивно сканиране на файловата система за 100% точност (Parallel Optimized).
    pub fn map_substrate(root: &Path) -> FileNode {
        let name = root
            .file_name()
            .map(|n| n.to_string_lossy().into_owned())
            .unwrap_or_else(|| "root".into());

        let is_dir = root.is_dir();

        if is_dir {
            let entries: Vec<_> = root
                .read_dir()
                .map(|e| e.flatten().collect())
                .unwrap_or_else(|_| Vec::new());

            // Parallel mapping of all children in this directory
            let child_nodes: Vec<FileNode> = entries
                .par_iter()
                .filter_map(|entry| {
                    let path = entry.path();
                    let path_str = path.to_string_lossy();

                    if path_str.contains("target")
                        || path_str.contains(".git")
                        || path_str.contains("node_modules")
                    {
                        return None;
                    }

                    Some(Self::map_substrate(&path))
                })
                .collect();

            let total_equity: f64 = child_nodes.iter().map(|n| n.value_eur).sum();
            let total_logic_mass: u64 = child_nodes.iter().map(|n| n.size).sum();

            FileNode {
                name,
                path: root.to_string_lossy().into_owned(),
                size: total_logic_mass,
                is_dir: true,
                children: child_nodes,
                value_eur: total_equity,
                purpose: if root.to_string_lossy().contains("micro_saas") {
                    "Sovereign Asset Cluster".into()
                } else {
                    "Neural Folder".into()
                },
            }
        } else {
            let metadata = root.metadata().ok();
            let size = metadata.map(|m| m.len()).unwrap_or(0);
            let (intrinsic_value, purpose) = Self::analyze_asset(root, size);

            let valuator = crate::omega::valuation::AssetValuator::new();
            let market_value = valuator.calculate_market_value(intrinsic_value);

            FileNode {
                name,
                path: root.to_string_lossy().into_owned(),
                size,
                is_dir: false,
                children: Vec::new(),
                value_eur: market_value,
                purpose,
            }
        }
    }

    fn analyze_asset(path: &Path, size: u64) -> (f64, String) {
        let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
        let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");

        match ext {
            "rs" => (size as f64 * 0.15, "Sovereign Logic Module".into()),
            "ts" | "js" => (size as f64 * 0.08, "Neural Interface Logic".into()),
            "html" => (size as f64 * 0.05, "Cognitive Mirror (UI)".into()),
            "soul" => (
                1000.0 + (size as f64 * 2.0),
                "Genetic Seed (Soul Fragment)".into(),
            ),
            _ if name.contains("README") || name.contains("DOC") => {
                (50.0, "Manifesto/Documentation".into())
            }
            _ => (size as f64 * 0.01, "Supporting Data".into()),
        }
    }
}
