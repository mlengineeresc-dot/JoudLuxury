-- Create the items table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Uncategorized',
    description TEXT,
    location TEXT NOT NULL,
    "buyingPrice" NUMERIC NOT NULL,
    "sellingPrice" NUMERIC NOT NULL,
    "actualProfit" NUMERIC NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "initialQuantity" INTEGER NOT NULL,
    "isSold" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "soldAt" TIMESTAMPTZ
);

-- Turn on Row Level Security (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies that allow anyone to read/write (for development)
-- NOTE: In production, you'll want to lock this down to authenticated users only.
CREATE POLICY "Allow public read access" ON items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON items FOR DELETE USING (true);


-- -----------------------------------------------------------------------------------------
-- CREATE STORAGE BUCKET FOR IMAGES
-- -----------------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for the storage bucket objects
CREATE POLICY "Allow public viewing of images" ON storage.objects FOR SELECT USING (bucket_id = 'item-images');
CREATE POLICY "Allow public upload of images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'item-images');
CREATE POLICY "Allow public update of images" ON storage.objects FOR UPDATE USING (bucket_id = 'item-images');
CREATE POLICY "Allow public delete of images" ON storage.objects FOR DELETE USING (bucket_id = 'item-images');

-- IF UPDATING AN EXISTING TABLE, RUN THIS:
-- ALTER TABLE items ADD COLUMN category TEXT NOT NULL DEFAULT 'Uncategorized';
