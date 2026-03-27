
;; nova-access-tokens.clar
;; Issues non-transferable (or restricted) tokens for event access. (Semi-fungible or NFT)
;; CLARITY VERSION: 2

(impl-trait .nova-trait-non-fungible.nova-trait-non-fungible)

(define-non-fungible-token event-ticket uint)

(define-map event-details
    uint
    {
        name: (string-ascii 64),
        price: uint,
        max-tickets: uint,
        sold-tickets: uint
    }
)

(define-data-var last-ticket-id uint u0)
(define-data-var last-event-id uint u0)

(define-map ticket-event-link uint uint) ;; ticket-id -> event-id

(define-constant ERR-SOLD-OUT (err u100))
(define-constant ERR-EVENT-NOT-FOUND (err u101))

(define-public (create-event (name (string-ascii 64)) (price uint) (max-supply uint))
    (let (
        (id (+ (var-get last-event-id) u1))
    )
    (map-set event-details id {
        name: name,
        price: price,
        max-tickets: max-supply,
        sold-tickets: u0
    })
    (var-set last-event-id id)
    (ok id))
)

(define-public (buy-ticket (event-id uint))
    (let (
        (event (unwrap! (map-get? event-details event-id) ERR-EVENT-NOT-FOUND))
        (sold (get sold-tickets event))
        (max (get max-tickets event))
        (ticket-id (+ (var-get last-ticket-id) u1))
        (sender tx-sender)
    )
    (asserts! (< sold max) ERR-SOLD-OUT)

    (try! (stx-transfer? (get price event) sender (as-contract tx-sender)))
    (try! (nft-mint? event-ticket ticket-id sender))

    (map-set ticket-event-link ticket-id event-id)
    (map-set event-details event-id (merge event { sold-tickets: (+ sold u1) }))
    (var-set last-ticket-id ticket-id)
    (ok ticket-id))
)

;; SIP-009 / Nova Trait Non Fungible

(define-read-only (get-last-token-id)
    (ok (var-get last-ticket-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok none)
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? event-ticket token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    ;; Restrict transfer logic if needed (e.g. soulbound)
    ;; For now allowing transfer
    (begin
        (asserts! (is-eq tx-sender sender) (err u102))
        (nft-transfer? event-ticket token-id sender recipient)
    )
)
