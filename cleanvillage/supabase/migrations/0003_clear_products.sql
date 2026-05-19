-- CleanVillage — Remove all sample products and product_images so the
-- catalog starts empty, ready for the client to insert real products
-- from the /admin/products page.
--
-- Idempotent: re-running this migration has no further effect once the
-- tables are empty.

delete from product_images;
delete from products;
