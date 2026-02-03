const mysql = require('mysql2/promise');
require('dotenv').config();

const categories = [
    { name: 'Electronics', description: 'Mobiles, Laptops, Cameras & more', image_url: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/69c6589653afdb9a.png' },
    { name: 'Fashion', description: 'Clothing, Footwear & Accessories', image_url: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png' },
    { name: 'Home & Furniture', description: 'Decor, Kitchen & Furnishing', image_url: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/ab7e2b022a4587dd.jpg' },
    { name: 'Appliances', description: 'TVs, ACs, Washing Machines & more', image_url: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0139228b2f7eb413.jpg' },
    { name: 'Beauty & Personal Care', description: 'Makeup, Skincare & Grooming', image_url: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/71050627a56b4693.png' },
    { name: 'Sports & Fitness', description: 'Gym Equipment, Sports Gear & more', image_url: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/bf4601b1e0e57524.png' }
];

const products = [
    // Electronics (category_id: 1)
    {
        name: 'Apple iPhone 15 Mobile (Blue, 128 GB)',
        description: 'iPhone 15 mobile brings you Dynamic Island, a 48MP Main camera, and USB-C—all in a durable color-infused glass and aluminum design.',
        price: 79990,
        original_price: 84900,
        discount_percent: 6,
        category_id: 1,
        brand: 'Apple',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/z/h/v/-original-imahgzhp9vgvyfkg.jpeg?q=70',
        rating: 4.6,
        rating_count: 12543,
        stock: 50,
        highlights: JSON.stringify(['128 GB ROM', '15.49 cm (6.1 inch) Super Retina XDR Display', '48MP + 12MP Dual Rear Camera', 'A16 Bionic Chip']),
        specifications: JSON.stringify({ 'Display': '6.1 inch Super Retina XDR', 'Processor': 'A16 Bionic', 'RAM': '6 GB', 'Storage': '128 GB', 'Battery': '3349 mAh' })
    },
    {
        name: 'Samsung Galaxy S24 Ultra 5G Mobile (Titanium Gray, 256 GB)',
        description: 'Experience next-level Galaxy AI with the most powerful Galaxy mobile smartphone yet.',
        price: 129999,
        original_price: 134999,
        discount_percent: 4,
        category_id: 1,
        brand: 'Samsung',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/4/b/p/-original-imahgzhpc8abrthu.jpeg?q=70',
        rating: 4.5,
        rating_count: 8934,
        stock: 30,
        highlights: JSON.stringify(['256 GB ROM', '17.27 cm (6.8 inch) Quad HD+ Display', '200MP + 50MP + 12MP + 10MP', 'Snapdragon 8 Gen 3']),
        specifications: JSON.stringify({ 'Display': '6.8 inch Dynamic AMOLED 2X', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12 GB', 'Storage': '256 GB', 'Battery': '5000 mAh' })
    },
    {
        name: 'OnePlus 12 Mobile (Flowy Emerald, 256 GB)',
        description: 'Flagship mobile performance with Snapdragon 8 Gen 3, Hasselblad Camera, and 100W SUPERVOOC.',
        price: 64999,
        original_price: 69999,
        discount_percent: 7,
        category_id: 1,
        brand: 'OnePlus',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/m/w/t/-original-imahhc4czn6fswwz.jpeg?q=70',
        rating: 4.4,
        rating_count: 15678,
        stock: 45,
        highlights: JSON.stringify(['256 GB ROM', '17.02 cm (6.7 inch) LTPO Display', '50MP + 48MP + 64MP', 'Snapdragon 8 Gen 3']),
        specifications: JSON.stringify({ 'Display': '6.7 inch 2K ProXDR', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12 GB', 'Storage': '256 GB', 'Battery': '5400 mAh' })
    },
    {
        name: 'Apple MacBook Air M3 (15 inch, 8GB RAM, 256GB SSD) Laptop',
        description: 'Supercharged by M3 chip laptop. Strikingly thin design. Up to 18 hours battery life.',
        price: 134900,
        original_price: 144900,
        discount_percent: 7,
        category_id: 1,
        brand: 'Apple',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/3/j/a/-original-imaguw6gsgg8kahz.jpeg',
        rating: 4.7,
        rating_count: 3456,
        stock: 25,
        highlights: JSON.stringify(['Apple M3 Chip', '8 GB Unified Memory', '256 GB SSD', '15.3 inch Liquid Retina Display']),
        specifications: JSON.stringify({ 'Display': '15.3 inch Liquid Retina', 'Processor': 'Apple M3', 'RAM': '8 GB', 'Storage': '256 GB SSD', 'Battery': 'Up to 18 hours' })
    },
    {
        name: 'HP Victus Gaming Laptop Intel Core i5 12th Gen',
        description: 'Gaming laptop with RTX 3050. 15.6 inch FHD display. Perfect for gaming and productivity.',
        price: 66500,
        original_price: 89990,
        discount_percent: 26,
        category_id: 1,
        brand: 'HP',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/1/o/w/-original-imahg4vkxdhcgyyu.jpeg',
        rating: 4.3,
        rating_count: 4567,
        stock: 30,
        highlights: JSON.stringify(['Intel Core i5 12th Gen', '16 GB DDR5 RAM', '512 GB SSD', 'RTX 3050 4GB Graphics']),
        specifications: JSON.stringify({ 'Display': '15.6 inch FHD 144Hz', 'Processor': 'Intel Core i5-12450HX', 'RAM': '16 GB', 'Storage': '512 GB SSD', 'Graphics': 'RTX 3050' })
    },
    {
        name: 'Lenovo IdeaPad Slim 3 Laptop Intel Core i5 13th Gen',
        description: 'Thin and light laptop for everyday use. 15.6 inch Full HD display with Windows 11.',
        price: 52990,
        original_price: 76891,
        discount_percent: 31,
        category_id: 1,
        brand: 'Lenovo',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/k/t/y/-original-imahg53xspmfrsdd.jpeg',
        rating: 4.2,
        rating_count: 2789,
        stock: 35,
        highlights: JSON.stringify(['Intel Core i5 13th Gen', '16 GB DDR5 RAM', '512 GB SSD', 'Windows 11 Home']),
        specifications: JSON.stringify({ 'Display': '15.6 inch FHD IPS', 'Processor': 'Intel Core i5-1335U', 'RAM': '16 GB', 'Storage': '512 GB SSD', 'OS': 'Windows 11' })
    },
    {
        name: 'DELL Inspiron 15 Laptop Intel Core i3 13th Gen',
        description: 'Affordable laptop for students and professionals. Reliable performance with long battery.',
        price: 40490,
        original_price: 52765,
        discount_percent: 23,
        category_id: 1,
        brand: 'Dell',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/q/w/m/-original-imahgx8whcxfcyhr.jpeg',
        rating: 4.2,
        rating_count: 3655,
        stock: 45,
        highlights: JSON.stringify(['Intel Core i3 13th Gen', '8 GB DDR4 RAM', '512 GB SSD', 'Windows 11']),
        specifications: JSON.stringify({ 'Display': '15.6 inch FHD', 'Processor': 'Intel Core i3-1305U', 'RAM': '8 GB', 'Storage': '512 GB SSD', 'OS': 'Windows 11' })
    },
    {
        name: 'ASUS Vivobook 15 Laptop AMD Ryzen 5',
        description: 'Powerful laptop with AMD Ryzen 5 processor. Slim design with fingerprint sensor.',
        price: 41990,
        original_price: 61990,
        discount_percent: 32,
        category_id: 1,
        brand: 'ASUS',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/e/c/n/-original-imahg4utbhmrhkcv.jpeg',
        rating: 4.3,
        rating_count: 1567,
        stock: 40,
        highlights: JSON.stringify(['AMD Ryzen 5 7520U', '8 GB DDR4 RAM', '512 GB SSD', 'Windows 11']),
        specifications: JSON.stringify({ 'Display': '15.6 inch FHD', 'Processor': 'AMD Ryzen 5 7520U', 'RAM': '8 GB', 'Storage': '512 GB SSD', 'OS': 'Windows 11' })
    },
    {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise cancellation with Auto NC Optimizer and Multipoint connection.',
        price: 29990,
        original_price: 34990,
        discount_percent: 14,
        category_id: 1,
        brand: 'Sony',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/kxyv0nk0/headphone/g/t/g/-original-imaga2g4zcsufhaq.jpeg',
        rating: 4.5,
        rating_count: 7823,
        stock: 60,
        highlights: JSON.stringify(['30 Hours Battery Life', 'Industry Leading ANC', 'Multipoint Connection', 'Hi-Res Audio']),
        specifications: JSON.stringify({ 'Driver': '30mm', 'Frequency Response': '4Hz-40kHz', 'Battery': '30 hours', 'Weight': '250g' })
    },

    // Fashion (category_id: 2)
    {
        name: 'Roadster Men Slim Fit Casual Shirt',
        description: 'Navy blue solid opaque casual shirt, has a spread collar, long sleeves, button placket.',
        price: 699,
        original_price: 1499,
        discount_percent: 53,
        category_id: 2,
        brand: 'Roadster',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/r/v/m/m-mens-check-shirts-metronaut-original-imagwg2hqqzpfqyx.jpeg',
        rating: 4.1,
        rating_count: 23456,
        stock: 200,
        highlights: JSON.stringify(['Slim Fit', '100% Cotton', 'Full Sleeves', 'Spread Collar']),
        specifications: JSON.stringify({ 'Material': '100% Cotton', 'Fit': 'Slim', 'Sleeve': 'Full', 'Pattern': 'Solid' })
    },
    {
        name: 'Nike Air Max SC Running Shoes',
        description: 'Mesh upper for breathability. Air Max cushioning for comfort. Rubber outsole for traction.',
        price: 5995,
        original_price: 7495,
        discount_percent: 20,
        category_id: 2,
        brand: 'Nike',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/z/w/f/-original-imagp6gudhzfmjfk.jpeg',
        rating: 4.3,
        rating_count: 8765,
        stock: 80,
        highlights: JSON.stringify(['Mesh Upper', 'Air Max Cushioning', 'Rubber Outsole', 'Lightweight']),
        specifications: JSON.stringify({ 'Material': 'Mesh', 'Sole': 'Rubber', 'Closure': 'Lace-Up', 'Ideal For': 'Running' })
    },
    {
        name: 'Levis Men 511 Slim Fit Jeans',
        description: 'Classic 511 slim fit jeans in dark indigo. Sits below waist, slim through hip and thigh.',
        price: 2499,
        original_price: 3999,
        discount_percent: 37,
        category_id: 2,
        brand: 'Levis',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/jean/i/w/h/32-sp24-511slim-aj-stoneage-r-levi-s-original-imah2s3evkfppuet.jpeg',
        rating: 4.2,
        rating_count: 34567,
        stock: 150,
        highlights: JSON.stringify(['511 Slim Fit', 'Cotton Blend', '5 Pocket Styling', 'Button Closure']),
        specifications: JSON.stringify({ 'Material': '98% Cotton, 2% Elastane', 'Fit': 'Slim', 'Rise': 'Mid Rise', 'Wash': 'Dark' })
    },
    {
        name: 'WROGN Men Printed Oversized T-Shirt',
        description: 'Black printed round neck oversized T-shirt with short sleeves.',
        price: 449,
        original_price: 1499,
        discount_percent: 70,
        category_id: 2,
        brand: 'WROGN',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/b/s/h/m-wrts007187-wrogn-original-imah3g6yp8zkhnkc.jpeg',
        rating: 4.0,
        rating_count: 12345,
        stock: 300,
        highlights: JSON.stringify(['Oversized Fit', '100% Cotton', 'Round Neck', 'Short Sleeves']),
        specifications: JSON.stringify({ 'Material': '100% Cotton', 'Fit': 'Oversized', 'Neck': 'Round', 'Sleeve': 'Short' })
    },
    {
        name: 'Allen Solly Men Formal Trousers',
        description: 'Navy blue solid formal trousers with flat front styling and 4 pockets.',
        price: 1299,
        original_price: 2599,
        discount_percent: 50,
        category_id: 2,
        brand: 'Allen Solly',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/trouser/h/z/e/32-atpnwsrf567379-allen-solly-original-imah2z7jyj3f6z4f.jpeg',
        rating: 4.1,
        rating_count: 8901,
        stock: 100,
        highlights: JSON.stringify(['Regular Fit', 'Polyester Blend', 'Flat Front', 'Machine Washable']),
        specifications: JSON.stringify({ 'Material': 'Polyester Blend', 'Fit': 'Regular', 'Style': 'Flat Front', 'Pockets': '4' })
    },

    // Home & Furniture (category_id: 3)
    {
        name: 'Wakefit Orthopedic Memory Foam Mattress (6 inch, King)',
        description: 'Medium firm mattress with high resilience foam and memory foam for ultimate comfort.',
        price: 15999,
        original_price: 24999,
        discount_percent: 36,
        category_id: 3,
        brand: 'Wakefit',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/kqidx8w0/bed-mattress/m/y/q/king-6-ortho-memory-foam-mattress-wakefit-foam-original-imag4g4vyfgz8pkh.jpeg',
        rating: 4.3,
        rating_count: 45678,
        stock: 40,
        highlights: JSON.stringify(['6 inch Thickness', 'Memory Foam', 'Medium Firm', '10 Year Warranty']),
        specifications: JSON.stringify({ 'Size': 'King (78x72 inches)', 'Thickness': '6 inch', 'Material': 'Memory Foam + HR Foam', 'Warranty': '10 Years' })
    },
    {
        name: 'Nilkamal Freedom Mini Shoe Cabinet',
        description: 'Compact shoe cabinet with 2 doors and weathered wood finish. Stores up to 8 pairs.',
        price: 2999,
        original_price: 4999,
        discount_percent: 40,
        category_id: 3,
        brand: 'Nilkamal',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/shoe-rack/h/q/t/-original-imaghgkhxwggvttx.jpeg',
        rating: 4.0,
        rating_count: 12345,
        stock: 35,
        highlights: JSON.stringify(['8 Pair Capacity', '2 Door Cabinet', 'Weather Wood Finish', 'Easy Assembly']),
        specifications: JSON.stringify({ 'Material': 'Engineered Wood', 'Capacity': '8 Pairs', 'Dimensions': '60x32x84 cm', 'Color': 'Weathered Wood' })
    },
    {
        name: 'Prestige Iris 750W Mixer Grinder (3 Jars)',
        description: 'Powerful 750W motor with 3 stainless steel jars for all your grinding needs.',
        price: 2999,
        original_price: 4495,
        discount_percent: 33,
        category_id: 3,
        brand: 'Prestige',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mixer-grinder-juicer/j/x/9/-original-imagrwfspnnwcpry.jpeg',
        rating: 4.2,
        rating_count: 23456,
        stock: 75,
        highlights: JSON.stringify(['750W Motor', '3 Stainless Steel Jars', 'Super Silent', '2 Year Warranty']),
        specifications: JSON.stringify({ 'Power': '750W', 'Jars': '3 (1.5L, 1L, 0.5L)', 'Material': 'Stainless Steel', 'Speed': '3 Speed + Pulse' })
    },
    {
        name: 'Urban Ladder Malabar Study Table',
        description: 'Solid wood study table with storage drawers. Perfect for work from home setup.',
        price: 12999,
        original_price: 18999,
        discount_percent: 32,
        category_id: 3,
        brand: 'Urban Ladder',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/office-study-table/z/e/b/-original-imaghfvhgvhpbzwa.jpeg',
        rating: 4.4,
        rating_count: 5678,
        stock: 20,
        highlights: JSON.stringify(['Solid Sheesham Wood', '2 Storage Drawers', 'Keyboard Tray', 'Honey Finish']),
        specifications: JSON.stringify({ 'Material': 'Sheesham Wood', 'Dimensions': '120x60x75 cm', 'Drawers': '2', 'Finish': 'Honey' })
    },
    {
        name: 'Story@Home Premium Curtains (Set of 2)',
        description: 'Blackout curtains with elegant design. Blocks 90% light and reduces noise.',
        price: 799,
        original_price: 1499,
        discount_percent: 47,
        category_id: 3,
        brand: 'Story@Home',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/curtain/y/i/3/-original-imagqfn7gzjfhzhq.jpeg',
        rating: 4.0,
        rating_count: 34567,
        stock: 200,
        highlights: JSON.stringify(['Blackout Technology', 'Set of 2', '90% Light Blocking', 'Machine Washable']),
        specifications: JSON.stringify({ 'Material': 'Polyester', 'Size': '7 feet (Door)', 'Pack': 'Set of 2', 'Type': 'Blackout' })
    },

    // Appliances (category_id: 4)
    {
        name: 'LG 1.5 Ton 5 Star AI Dual Inverter Split AC',
        description: 'Energy efficient AC with AI convertible 6-in-1 cooling and HD filter.',
        price: 49990,
        original_price: 69990,
        discount_percent: 29,
        category_id: 4,
        brand: 'LG',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/air-conditioner-new/g/k/g/-original-imagmgqjkmpfkacn.jpeg',
        rating: 4.4,
        rating_count: 12345,
        stock: 25,
        highlights: JSON.stringify(['1.5 Ton Capacity', '5 Star Rating', 'AI Dual Inverter', '4 Way Swing']),
        specifications: JSON.stringify({ 'Capacity': '1.5 Ton', 'Star Rating': '5 Star', 'Type': 'Split', 'Cooling': 'AI Convertible 6-in-1' })
    },
    {
        name: 'Samsung 253L Frost Free Double Door Refrigerator',
        description: 'Convertible 5-in-1 refrigerator with digital inverter technology.',
        price: 24990,
        original_price: 31990,
        discount_percent: 22,
        category_id: 4,
        brand: 'Samsung',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/refrigerator-new/f/6/q/-original-imagpgg7bxhfazht.jpeg',
        rating: 4.3,
        rating_count: 23456,
        stock: 35,
        highlights: JSON.stringify(['253L Capacity', 'Frost Free', 'Digital Inverter', 'Convertible 5-in-1']),
        specifications: JSON.stringify({ 'Capacity': '253L', 'Type': 'Double Door', 'Star Rating': '3 Star', 'Technology': 'Digital Inverter' })
    },
    {
        name: 'IFB 7kg Fully Automatic Front Load Washing Machine',
        description: 'Front load washing machine with aqua energie and ball valve technology.',
        price: 28990,
        original_price: 36990,
        discount_percent: 22,
        category_id: 4,
        brand: 'IFB',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/washing-machine-new/u/l/z/-original-imagtnhrhk5fjknh.jpeg',
        rating: 4.2,
        rating_count: 8765,
        stock: 30,
        highlights: JSON.stringify(['7kg Capacity', 'Front Load', 'Aqua Energie', 'In-built Heater']),
        specifications: JSON.stringify({ 'Capacity': '7 kg', 'Type': 'Front Load', 'Spin Speed': '1200 RPM', 'Programs': '15' })
    },
    {
        name: 'Sony Bravia 55 inch 4K Ultra HD Smart LED Google TV',
        description: 'Triluminos Pro display with Cognitive Processor XR for stunning picture quality.',
        price: 69990,
        original_price: 99990,
        discount_percent: 30,
        category_id: 4,
        brand: 'Sony',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/television/u/a/d/-original-imagrkhsrg6jb7sn.jpeg',
        rating: 4.5,
        rating_count: 6789,
        stock: 20,
        highlights: JSON.stringify(['55 inch Display', '4K Ultra HD', 'Google TV', 'Dolby Vision & Atmos']),
        specifications: JSON.stringify({ 'Screen Size': '55 inch', 'Resolution': '3840x2160', 'Smart TV': 'Google TV', 'Sound': 'Dolby Atmos' })
    },
    {
        name: 'Philips 1200W Air Fryer',
        description: 'Rapid air technology for healthier frying with up to 90% less fat.',
        price: 6999,
        original_price: 9995,
        discount_percent: 30,
        category_id: 4,
        brand: 'Philips',
        image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/air-fryer/c/l/m/-original-imagmx85afexdz2h.jpeg',
        rating: 4.3,
        rating_count: 15678,
        stock: 50,
        highlights: JSON.stringify(['1200W Power', '4.1L Capacity', 'Rapid Air Technology', '90% Less Fat']),
        specifications: JSON.stringify({ 'Power': '1200W', 'Capacity': '4.1L', 'Technology': 'Rapid Air', 'Timer': '30 minutes' })
    },

    // Beauty & Personal Care (category_id: 5)
    {
        name: 'Maybelline New York Fit Me Foundation - Beauty Essential',
        description: 'Beauty essential liquid foundation with SPF 22 for natural matte finish. Poreless and oil-free beauty product.',
        price: 399,
        original_price: 499,
        discount_percent: 20,
        category_id: 5,
        brand: 'Maybelline',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/foundation/b/z/m/-original-imagqr4dwkb7dwxn.jpeg',
        rating: 4.1,
        rating_count: 45678,
        stock: 150,
        highlights: JSON.stringify(['SPF 22', 'Matte Finish', 'Oil-Free', '30ml']),
        specifications: JSON.stringify({ 'Volume': '30ml', 'SPF': '22', 'Finish': 'Matte', 'Skin Type': 'All' })
    },
    {
        name: 'Philips BT3221/15 Beard Trimmer',
        description: 'DuraPower technology for 4x longer lasting performance. 20 length settings.',
        price: 1599,
        original_price: 2195,
        discount_percent: 27,
        category_id: 5,
        brand: 'Philips',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/trimmer/a/k/p/-original-imaghsh5gbsnspzu.jpeg',
        rating: 4.2,
        rating_count: 67890,
        stock: 80,
        highlights: JSON.stringify(['20 Length Settings', 'DuraPower Technology', '90 Min Runtime', 'Washable Heads']),
        specifications: JSON.stringify({ 'Runtime': '90 minutes', 'Charge Time': '1 hour', 'Settings': '20', 'Battery': 'Lithium-ion' })
    },
    {
        name: 'Lakme 9 to 5 Primer + Matte Lipstick',
        description: 'Long-lasting matte lipstick with built-in primer for smooth application.',
        price: 449,
        original_price: 625,
        discount_percent: 28,
        category_id: 5,
        brand: 'Lakme',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/lipstick/c/r/w/-original-imaggzunf2dfxsqz.jpeg',
        rating: 4.0,
        rating_count: 23456,
        stock: 200,
        highlights: JSON.stringify(['12 Hour Stay', 'Built-in Primer', 'Matte Finish', 'Cruelty Free']),
        specifications: JSON.stringify({ 'Weight': '3.6g', 'Finish': 'Matte', 'Duration': '12 hours', 'Type': 'Bullet' })
    },
    {
        name: 'The Body Shop Vitamin E Moisture Cream',
        description: 'Lightweight 48-hour moisture cream with vitamin E and hyaluronic acid.',
        price: 1295,
        original_price: 1495,
        discount_percent: 13,
        category_id: 5,
        brand: 'The Body Shop',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/moisturizer-cream/h/z/e/-original-imagr9fssnnfrkzh.jpeg',
        rating: 4.3,
        rating_count: 12345,
        stock: 60,
        highlights: JSON.stringify(['48 Hour Moisture', 'Vitamin E', 'Hyaluronic Acid', 'Lightweight']),
        specifications: JSON.stringify({ 'Volume': '50ml', 'Skin Type': 'All', 'Ingredients': 'Vitamin E, Hyaluronic Acid', 'SPF': 'No' })
    },
    {
        name: 'Biotique Bio Dandelion Sunscreen SPF 50',
        description: 'Ayurvedic sunscreen with dandelion extract. Ultra protective and non-greasy.',
        price: 299,
        original_price: 399,
        discount_percent: 25,
        category_id: 5,
        brand: 'Biotique',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sunscreen/n/j/n/-original-imaghvv3zxhshbmv.jpeg',
        rating: 4.0,
        rating_count: 34567,
        stock: 120,
        highlights: JSON.stringify(['SPF 50', 'Non-Greasy', 'Ayurvedic', 'Water Resistant']),
        specifications: JSON.stringify({ 'Volume': '50ml', 'SPF': '50', 'Type': 'Lotion', 'Skin Type': 'All' })
    },

    // Sports & Fitness (category_id: 6)
    {
        name: 'Boldfit Sports Yoga Mat (6mm, Anti-Slip)',
        description: 'Extra thick sports yoga mat with anti-slip texture. Eco-friendly TPE material for sports and fitness.',
        price: 599,
        original_price: 1299,
        discount_percent: 54,
        category_id: 6,
        brand: 'Boldfit',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sport-mat/x/b/b/-original-imagqzn5agfnvhza.jpeg',
        rating: 4.1,
        rating_count: 23456,
        stock: 150,
        highlights: JSON.stringify(['6mm Thickness', 'Anti-Slip', 'Eco-Friendly TPE', 'Carry Strap Included']),
        specifications: JSON.stringify({ 'Thickness': '6mm', 'Material': 'TPE', 'Dimensions': '183x61 cm', 'Weight': '800g' })
    },
    {
        name: 'KOBO 20kg Adjustable Dumbbell Set',
        description: 'PVC coated dumbbell set with adjustable weight plates. Perfect for home gym.',
        price: 1999,
        original_price: 3499,
        discount_percent: 43,
        category_id: 6,
        brand: 'KOBO',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/dumbbell/y/n/i/-original-imaghgyhndpxffzk.jpeg',
        rating: 4.0,
        rating_count: 12345,
        stock: 60,
        highlights: JSON.stringify(['20kg Total Weight', 'PVC Coated', 'Adjustable', 'Non-Slip Grip']),
        specifications: JSON.stringify({ 'Weight': '20kg (10kg x 2)', 'Material': 'Cast Iron + PVC', 'Type': 'Adjustable', 'Grip': 'Rubber' })
    },
    {
        name: 'Nivia Storm Football (Size 5)',
        description: 'Machine stitched football with rubberised outer cover. FIFA approved size.',
        price: 549,
        original_price: 799,
        discount_percent: 31,
        category_id: 6,
        brand: 'Nivia',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/ball/k/n/d/-original-imaghf9zxgqchapy.jpeg',
        rating: 4.2,
        rating_count: 8765,
        stock: 100,
        highlights: JSON.stringify(['Size 5', 'Machine Stitched', 'Rubberised Cover', 'All Surface']),
        specifications: JSON.stringify({ 'Size': '5', 'Material': 'Rubber', 'Stitching': 'Machine', 'Use': 'All Surfaces' })
    },
    {
        name: 'Fitbit Charge 6 Fitness Tracker',
        description: 'Advanced health and fitness tracker with GPS, heart rate, and sleep tracking.',
        price: 14999,
        original_price: 18999,
        discount_percent: 21,
        category_id: 6,
        brand: 'Fitbit',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/fitness-band/w/z/m/-original-imagrz6hpfzk9ndy.jpeg',
        rating: 4.3,
        rating_count: 5678,
        stock: 40,
        highlights: JSON.stringify(['Built-in GPS', 'Heart Rate Monitor', 'Sleep Tracking', '7 Day Battery']),
        specifications: JSON.stringify({ 'Battery': '7 days', 'GPS': 'Built-in', 'Water Resistance': '50m', 'Display': 'AMOLED' })
    },
    {
        name: 'Vector X VX-520 Badminton Racket (Pack of 2)',
        description: 'Lightweight badminton racket set with cover. Ideal for recreational play.',
        price: 399,
        original_price: 699,
        discount_percent: 43,
        category_id: 6,
        brand: 'Vector X',
        image_url: 'https://rukminim2.flixcart.com/image/612/612/xif0q/racquet/3/t/w/-original-imaghghwp7zhbyfn.jpeg',
        rating: 3.9,
        rating_count: 15678,
        stock: 120,
        highlights: JSON.stringify(['Pack of 2', 'Steel Shaft', 'Full Cover', 'Lightweight']),
        specifications: JSON.stringify({ 'Material': 'Steel + Aluminum', 'Weight': '95g each', 'Level': 'Beginner', 'Grip': 'Synthetic' })
    }
];

async function seed() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'flipkart_clone',
            multipleStatements: true
        });

        console.log('🌱 Starting seed process...\n');

        // Clear existing data
        console.log('Clearing existing data...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE order_items');
        await connection.query('TRUNCATE TABLE orders');
        await connection.query('TRUNCATE TABLE cart_items');
        await connection.query('TRUNCATE TABLE products');
        await connection.query('TRUNCATE TABLE categories');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // Insert categories
        console.log('Inserting categories...');
        for (const category of categories) {
            await connection.query(
                'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
                [category.name, category.description, category.image_url]
            );
        }
        console.log(`✅ Inserted ${categories.length} categories\n`);

        // Insert products
        console.log('Inserting products...');
        for (const product of products) {
            await connection.query(`
                INSERT INTO products 
                (name, description, price, original_price, discount_percent, category_id, brand, image_url, rating, rating_count, stock, highlights, specifications)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                product.name,
                product.description,
                product.price,
                product.original_price,
                product.discount_percent,
                product.category_id,
                product.brand,
                product.image_url,
                product.rating,
                product.rating_count,
                product.stock,
                product.highlights,
                product.specifications
            ]);
        }
        console.log(`✅ Inserted ${products.length} products\n`);

        // Create a test user
        console.log('Creating test user...');
        await connection.query(
            'INSERT IGNORE INTO users (id, email, name) VALUES (?, ?, ?)',
            ['test-user-123', 'test@example.com', 'Test User']
        );
        console.log('✅ Test user ready (ID: test-user-123)\n');

        console.log('═══════════════════════════════════════════');
        console.log('🎉 Seed completed successfully!');
        console.log('═══════════════════════════════════════════');
        console.log('\nSummary:');
        console.log(`  • ${categories.length} categories`);
        console.log(`  • ${products.length} products`);
        console.log(`  • 1 test user`);
        console.log('\nTest user ID for API calls: test-user-123');
        console.log('Use header: x-user-id: test-user-123');

    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

seed();
