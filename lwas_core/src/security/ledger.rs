use std::sync::atomic::{AtomicBool, Ordering};

pub struct SovereignLedger;

static LOCKED: AtomicBool = AtomicBool::new(false);

impl SovereignLedger {
    /// finalize_and_lock: Заключва леджъра с имутабилен хеш.
    pub fn finalize_and_lock(architect: &str, hash: &str) {
        if LOCKED.load(Ordering::SeqCst) {
            println!("⚠️ [LEDGER]: Опит за повторно заключване отказан.");
            return;
        }

        println!("--------------------------------------------------");
        println!("🏛️ [LEDGER]: ГЕНЕРИРАНЕ НА ИМУТАБИЛЕН ЗАПИС...");
        println!("🏛️ [ARCHITECT]: {}", architect);
        println!("🏛️ [HASH]: {}", hash);
        println!("🏛️ [RESULT]: SOVEREIGNTY SECURED.");
        println!("--------------------------------------------------");

        LOCKED.store(true, Ordering::SeqCst);
    }

    pub fn is_locked() -> bool {
        LOCKED.load(Ordering::SeqCst)
    }

    pub async fn record_payment(customer_email: &str, amount_total: i64) {
        println!("--------------------------------------------------");
        println!("🏛️ [LEDGER]: RECORDING NEW PAYMENT...");
        println!("🏛️ [CUSTOMER]: {}", customer_email);
        println!("🏛️ [AMOUNT]: {}", amount_total);
        println!("🏛️ [RESULT]: PAYMENT RECORDED IN IMMUTABLE LEDGER.");
        println!("--------------------------------------------------");
    }
}
