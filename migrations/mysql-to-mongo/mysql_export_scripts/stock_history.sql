SELECT
no_trans as trx_id,
productid as product_id,
jumlah_gram as total_gram,
harga_pergram as price_in_gram,
total_harga as total_price,
created_date,
( CASE
WHEN transaksi = 1 THEN 'in'
WHEN transaksi = -1 THEN 'out'
END) as type
FROM ant_price_stock_history;