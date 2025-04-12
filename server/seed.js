import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import slugify from 'slugify';

// Import models
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Review from './models/review.js';

dotenv.config();

// Update MongoDB connection URI to use cluster directly instead of env variable
const MONGODB_URI = process.env.MONGO_URI;

const ProductImages = [
    'https://res.cloudinary.com/kenox/image/upload/v1741443933/myFood/aawyoqqaeoxs1xvzxo0k.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443847/myFood/bvz08ax3dyefp32fi1gq.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443909/myFood/c35keiztw2srgoffuntu.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443869/myFood/caxmw88cljbvciuzphy1.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443902/myFood/cddaygss4skwritr2d56.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443926/myFood/dccyxemfwom117z6p6bk.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443921/myFood/derq2sguqveosuiufeqh.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443907/myFood/dizv0dfyclhmmo27lejq.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443838/myFood/djyvgyr6v21ujyky0oov.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443857/myFood/dzdcgic2l7jfhoosiqjb.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443916/myFood/e6d5ge0tcs5ryowwuu1s.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443911/myFood/ecicotvqpvhmt4naeeii.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443856/myFood/epty8riptqm7fjoiksqc.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443853/myFood/etlvmsqmwuxx5andoayk.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443871/myFood/ewj6lwxpmehzrdphtbi5.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443905/myFood/eyznzpca2dhhae8uvhua.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443899/myFood/fduo8duw6gua6k4txqv8.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443943/myFood/fsx4bv0clw1fvmhuox2z.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443932/myFood/glbbkeld6eeb5urkl3hq.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443928/myFood/hmnae6fn6fd4esvkh8st.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443863/myFood/hpifcftxuoe2wklgsslv.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443946/myFood/iak4meuotqyz6sfd8mbz.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443882/myFood/ibmseyapfp0hiob7ib80.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443885/myFood/iiuyb0kc1blcrswuvh4h.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443868/myFood/ir2ereucdtnf1m4hnsnv.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443935/myFood/iuq6dvqdjk9ywkxvhiyg.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443892/myFood/iyawvmay6ibm46cwifgj.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443872/myFood/ja13fow4wqlntlsx5jd5.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443919/myFood/ja7bdl1zm71qqfcvol9w.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443920/myFood/jn1pfk8hxqmz6tjpss9v.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443865/myFood/jv5bpiunozuipruarjup.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443912/myFood/k90hgdzeeoxelzeu3kzk.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443908/myFood/keg2k9bbswpmohkskpf3.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443904/myFood/lmyaqphhojectpusadce.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443948/myFood/m8pfr3dqyotf85xz8bmo.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443894/myFood/nf0pj0beoclxe8g2mk3q.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443873/myFood/nf89vlelcrpnegkey1a6.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443884/myFood/njmvmhezwcfadrmarpbi.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443893/myFood/nqc6mgihzuhtlxy1btw0.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443888/myFood/oatsrumrwwvriukdhq3q.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443851/myFood/ol0kmvbh4wscxqhgct6w.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443929/myFood/omrmdw4nqlalycawm0hd.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443878/myFood/onnfudjremtdkr0o6aot.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443925/myFood/otlbjz45csulae4mcrou.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443850/myFood/ovgeueb6vjmmyg4dc3uh.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443859/myFood/oyfodrz4g6odelbuqfdw.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443843/myFood/p63ukibsu1hpr4xoormp.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443876/myFood/ph58kibrxfcjiw1cvlyn.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443842/myFood/pn6rufm5khfuj5gqrybx.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443861/myFood/pyugyg9m4ejim9eu1lw5.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443866/myFood/q7ij88uc3vf3ze6e9m0i.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443898/myFood/qbkoe4trq9cgk3d888nc.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443845/myFood/qcrqmdkcgsl8ub08nui9.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443934/myFood/qhv4oburomemoyhlbdpi.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443924/myFood/qkxjlqhzyu0hmfaylc5r.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443854/myFood/qxpzu7i2b3acecd6tkad.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443880/myFood/rdxnho9djk64okg709at.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443914/myFood/rn9siqd6u4cdpbzd5yl1.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443840/myFood/rnltezhlmoenvdadkpzr.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443852/myFood/s3vdnzfbja8hzxtzazcd.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443945/myFood/swcfeiq1j5dzychswede.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443940/myFood/tfuaav9mqxmxilmdwcyd.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443891/myFood/tosbdclbcm0a2gv07kqu.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443846/myFood/tosskfbqxsdnrful9jvy.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443938/myFood/touxrdvrqftf43lwfy5i.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443858/myFood/ty6xhynxai1fciftudfd.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443897/myFood/uuelspct62gjnsqnzi7s.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443895/myFood/uusc6xhqj9tdejbxxrxi.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443867/myFood/v7rmbmzvaxpp62jlcr9u.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443918/myFood/viiow3dv1btmxkbvqkda.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443839/myFood/vzoi8ow9vcyzun9mgicd.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443923/myFood/w6ztb1mm2gt7hddx3bpf.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443947/myFood/wogg0gjht1cs0cnzgoav.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443848/myFood/x3binyfxacss4rclaeih.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443881/myFood/xbpxypixr1yyhjf661wo.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443889/myFood/xdf87bb9nchzpdohnadl.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443862/myFood/xho6az9vnc9hp63ekc3i.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443874/myFood/xw1chybhevvdzio1bzzr.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443942/myFood/y7co02rhtpryqj3lr7yz.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443937/myFood/y7miidvbcxsj5e1pwvkz.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443877/myFood/yep7flv2mg2ricmum9sl.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443886/myFood/yoz6x67507hofx4pbkvo.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443931/myFood/ysrquhru74pugdyyvbjs.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443941/myFood/zhq2ymrblwn4wlmtzika.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1741443900/myFood/zvvfileikdti1nunib8z.jpg'
];

const profilePictures = [
    'https://res.cloudinary.com/kenox/image/upload/v1738745383/profile_pictures/ab5knqwuqu0zuvrdr7ro.png',
    'https://res.cloudinary.com/kenox/image/upload/v1738743904/profile_pictures/adrfd9fybpxuw2km9mtn.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738816354/profile_pictures/da9zol9pyuyxewlean9e.png',
    'https://res.cloudinary.com/kenox/image/upload/v1738355338/profile_pictures/rgez7zibuxhso8wsmcyf.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738358281/profile_pictures/sbx81vkapqkzmge0aca2.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738354817/profile_pictures/ssbysjzegd28hvgc8mdy.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738358280/profile_pictures/user_67976eaa3466e66e9c382d35_1738358273835.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738358398/profile_pictures/user_67976eaa3466e66e9c382d35_1738358396425.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738743903/profile_pictures/user_67976eaa3466e66e9c382d35_1738743895419.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738354816/profile_pictures/user_67976eaa3466e66e9c382d36_1738354812733.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738355336/profile_pictures/user_67976eaa3466e66e9c382d36_1738355333569.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738744963/profile_pictures/user_67a3246994cd02f31d282630_1738744954398.png',
    'https://res.cloudinary.com/kenox/image/upload/v1738745382/profile_pictures/user_67a325f635327e15307afae3_1738745377452.png',
    'https://res.cloudinary.com/kenox/image/upload/v1738748361/profile_pictures/user_67a325f635327e15307afae3_1738748348170.png',
    'https://res.cloudinary.com/kenox/image/upload/v1738816353/profile_pictures/user_67a43a45640b7ba07616999a_1738816351997.png',
    'https://res.cloudinary.com/kenox/image/upload/v1738358399/profile_pictures/wmfzhwdnsoufq5axiqir.jpg',
    'https://res.cloudinary.com/kenox/image/upload/v1738744964/profile_pictures/xfapi3ka1jfi6nnf08nx.png',
    'https://res.cloudinary.com/kenox/image/upload/v1738748363/profile_pictures/yi4s37paqzwe0erdak8o.png'
];

// Helper function to get random images
const getRandomImages = (count = 3) => {
    const shuffled = [...ProductImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Helper function to generate variants
const generateVariants = () => {
    const variants = [];
    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = ['Red', 'Blue', 'Black', 'White', 'Green'];
    
    for (let i = 0; i < faker.number.int({ min: 1, max: 4 }); i++) {
        variants.push({
            size: faker.helpers.arrayElement(sizes),
            color: faker.helpers.arrayElement(colors),
            quantity: faker.number.int({ min: 0, max: 100 })
        });
    }
    return variants;
};

// Helper function to generate a unique slug
const generateUniqueSlug = (name) => {
    return slugify(name, {
        lower: true,
        strict: true,
        trim: true
    });
};

async function seedDatabase() {
    try {
        // Connect to MongoDB cluster
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB cluster');

        // Clear existing collections instead of dropping database
        console.log('Clearing existing collections...');
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            Order.deleteMany({}),
            Review.deleteMany({})
        ]);
        console.log('Collections cleared. Starting to seed...');

        // Create categories
        const categoryData = [
            { name: 'Electronics', description: 'Electronic gadgets and devices' },
            { name: 'Clothing', description: 'Fashion and apparel' },
            { name: 'Books', description: 'Books and literature' },
            { name: 'Home & Garden', description: 'Home decoration and garden supplies' },
            { name: 'Sports', description: 'Sports equipment and accessories' },
        ];

        const categories = await Category.insertMany(
            categoryData.map(cat => ({
                ...cat,
                slug: generateUniqueSlug(cat.name)
            }))
        );

        // Create users
        const users = [];
        for (let i = 0; i < 20; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const user = {
                name: `${firstName} ${lastName}`,
                username: faker.internet.username(),
                email: faker.internet.email({ firstName, lastName }),
                password: await bcrypt.hash('password123', 10),
                phone: faker.phone.number('+1##########'),
                role: i === 0 ? 'admin' : 'user',
                // Add profile picture - cycle through the array if more users than pictures
                profilePicture: profilePictures[i % profilePictures.length],
                addresses: [{
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    country: 'United States',
                    zipCode: faker.location.zipCode()
                }]
            };
            users.push(user);
        }
        const savedUsers = await User.insertMany(users);

        // Create products
        const products = [];
        for (let i = 0; i < 60; i++) {
            const name = faker.commerce.productName();
            const product = {
                name,
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
                category: faker.helpers.arrayElement(categories)._id,
                images: getRandomImages(faker.number.int({ min: 1, max: 5 })),
                variants: generateVariants(),
                inStock: faker.datatype.boolean(),
                rating: 0, // Initialize with 0 (will be updated with reviews)
                numReviews: 0, // Initialize with 0 (will be updated with reviews)
                tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.commerce.productAdjective())
            };
            products.push(product);
        }
        const savedProducts = await Product.insertMany(products);

        // Create reviews
        const reviews = [];
        for (const product of savedProducts) {
            const reviewCount = faker.number.int({ min: 0, max: 10 });
            let totalRating = 0;
            
            for (let i = 0; i < reviewCount; i++) {
                const user = faker.helpers.arrayElement(savedUsers);
                const rating = faker.number.int({ min: 1, max: 5 });
                totalRating += rating;
                
                const review = {
                    user: user._id,
                    product: product._id,
                    rating,
                    comment: faker.lorem.paragraph()
                };
                reviews.push(review);
            }
            
            // Update product with rating and review count
            if (reviewCount > 0) {
                const avgRating = totalRating / reviewCount;
                await Product.findByIdAndUpdate(product._id, {
                    rating: avgRating,
                    numReviews: reviewCount
                });
            }
        }
        const savedReviews = await Review.insertMany(reviews);

        // Update products with review IDs
        for (const review of savedReviews) {
            await Product.findByIdAndUpdate(
                review.product,
                { $push: { reviews: review._id } }
            );
        }

        // Create orders
        const orders = [];
        const orderStatuses = ['pending', 'filled', 'canceled'];
        const paymentMethods = ['card', 'mobile_money', 'PayOnDelivery'];
        const paymentStatuses = ['paid', 'unpaid', 'refunded'];

        for (const user of savedUsers) {
            for (let i = 0; i < faker.number.int({ min: 0, max: 3 }); i++) {
                const orderProducts = faker.helpers.arrayElements(savedProducts, faker.number.int({ min: 1, max: 5 }))
                    .map(product => {
                        const variant = product.variants.length > 0 ? 
                            faker.helpers.arrayElement(product.variants) : 
                            { size: 'M', color: 'Black' };
                            
                        return {
                            productId: product._id,
                            quantity: faker.number.int({ min: 1, max: 5 }),
                            size: variant.size,
                            color: variant.color,
                            priceAtPurchase: product.price
                        };
                    });

                const totalPrice = orderProducts.reduce((sum, item) => 
                    sum + (item.priceAtPurchase * item.quantity), 0
                );

                const order = {
                    userId: user._id,
                    products: orderProducts,
                    totalPrice,
                    status: faker.helpers.arrayElement(orderStatuses),
                    shippingAddress: {
                        street: faker.location.streetAddress(),
                        city: faker.location.city(),
                        state: faker.location.state(),
                        zipCode: faker.location.zipCode(),
                        country: 'United States'
                    },
                    paymentMethod: faker.helpers.arrayElement(paymentMethods),
                    paymentStatus: faker.helpers.arrayElement(paymentStatuses),
                    hasCoupon: faker.datatype.boolean()
                };
                orders.push(order);
            }
        }
        const savedOrders = await Order.insertMany(orders);

        // Update users with their orders
        for (const order of savedOrders) {
            await User.findByIdAndUpdate(
                order.userId,
                { $push: { orders: order._id } }
            );
        }

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seeder
seedDatabase();