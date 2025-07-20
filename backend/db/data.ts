// This file replaces the in-memory database with MongoDB using Mongoose models
import { 
  Product, 
  SoftwareProduct, 
  BlogPost, 
  JobOpening, 
  User, 
  Order,
  ProductDocument,
  SoftwareProductDocument,
  BlogPostDocument,
  JobOpeningDocument,
  UserDocument,
  OrderDocument
} from '../models';

// Re-export the interfaces from the original data.ts file
export { 
  Product as ProductInterface, 
  SoftwareProduct as SoftwareProductInterface, 
  BlogPost as BlogPostInterface, 
  JobOpening as JobOpeningInterface, 
  User as UserInterface, 
  Order as OrderInterface 
} from '../data';

// Data Access & Manipulation Functions

// Get all data (for compatibility with existing code)
export const getData = async () => {
  const [products, softwareProducts, blogPosts, jobOpenings, users, orders] = await Promise.all([
    Product.find().exec(),
    SoftwareProduct.find().exec(),
    BlogPost.find().exec(),
    JobOpening.find().exec(),
    User.find().exec(),
    Order.find().exec()
  ]);

  return { products, softwareProducts, blogPosts, jobOpenings, users, orders };
};

// Product functions
export const findProduct = async (id: string) => {
  return await Product.findById(id).exec();
};

export const saveProduct = async (product: any) => {
  if (product.id) {
    // Update existing product
    const updatedProduct = await Product.findByIdAndUpdate(
      product.id,
      { ...product, _id: product.id },
      { new: true, runValidators: true }
    ).exec();
    return updatedProduct;
  } else {
    // Create new product
    const newProduct = new Product(product);
    await newProduct.save();
    return newProduct;
  }
};

export const deleteProduct = async (id: string) => {
  await Product.findByIdAndDelete(id).exec();
};

// Software Product functions
export const findSoftwareProduct = async (id: string) => {
  return await SoftwareProduct.findById(id).exec();
};

export const saveSoftwareProduct = async (softwareProduct: any) => {
  if (softwareProduct.id) {
    // Update existing software product
    const updatedSoftwareProduct = await SoftwareProduct.findByIdAndUpdate(
      softwareProduct.id,
      { ...softwareProduct, _id: softwareProduct.id },
      { new: true, runValidators: true }
    ).exec();
    return updatedSoftwareProduct;
  } else {
    // Create new software product
    const newSoftwareProduct = new SoftwareProduct(softwareProduct);
    await newSoftwareProduct.save();
    return newSoftwareProduct;
  }
};

export const deleteSoftwareProduct = async (id: string) => {
  await SoftwareProduct.findByIdAndDelete(id).exec();
};

// User functions
export const findUser = async (id: string) => {
  return await User.findById(id).exec();
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email }).exec();
};

export const saveUser = async (user: any) => {
  if (user.id) {
    // Update existing user
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { ...user, _id: user.id },
      { new: true, runValidators: true }
    ).exec();
    return updatedUser;
  } else {
    // Create new user
    // Generate an ID if one doesn't exist
    const userId = user.id || `user_${Date.now()}`;
    const newUser = new User({
      ...user,
      _id: userId,
      id: userId
    });
    await newUser.save();
    return newUser;
  }
};

export const deleteUser = async (id: string) => {
  await User.findByIdAndDelete(id).exec();
};

// Blog Post functions
export const saveBlogPost = async (post: any) => {
  if (post.id) {
    // Update existing blog post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      post.id,
      { ...post, _id: post.id },
      { new: true, runValidators: true }
    ).exec();
    return updatedPost;
  } else {
    // Create new blog post
    const newPost = new BlogPost(post);
    await newPost.save();
    return newPost;
  }
};

export const deleteBlogPost = async (id: string) => {
  await BlogPost.findByIdAndDelete(id).exec();
};

// Job Opening functions
export const saveJobOpening = async (job: any) => {
  if (job.id) {
    // Update existing job opening
    const updatedJob = await JobOpening.findByIdAndUpdate(
      job.id,
      { ...job, _id: job.id },
      { new: true, runValidators: true }
    ).exec();
    return updatedJob;
  } else {
    // Create new job opening
    const newJob = new JobOpening(job);
    await newJob.save();
    return newJob;
  }
};

export const deleteJobOpening = async (id: string) => {
  await JobOpening.findByIdAndDelete(id).exec();
};

// Order functions
export const findOrder = async (id: string) => {
  return await Order.findById(id).exec();
};

export const saveOrder = async (order: any) => {
  if (order.id) {
    // Update existing order
    const updatedOrder = await Order.findByIdAndUpdate(
      order.id,
      { ...order, _id: order.id },
      { new: true, runValidators: true }
    ).exec();
    return updatedOrder;
  } else {
    // Create new order
    const newOrder = new Order(order);
    await newOrder.save();
    return newOrder;
  }
};

// Initialize the database with seed data if it's empty
export const initializeDatabase = async () => {
  // Import the original data
  const { 
    products: seedProducts, 
    softwareProducts: seedSoftwareProducts, 
    blogPosts: seedBlogPosts, 
    jobOpenings: seedJobOpenings, 
    users: seedUsers, 
    orders: seedOrders 
  } = await import('../data').then(module => module.getData());

  // Check if collections are empty and seed them if they are
  const [productCount, softwareCount, blogCount, jobCount, userCount, orderCount] = await Promise.all([
    Product.countDocuments(),
    SoftwareProduct.countDocuments(),
    BlogPost.countDocuments(),
    JobOpening.countDocuments(),
    User.countDocuments(),
    Order.countDocuments()
  ]);

  const seedPromises = [];

  if (productCount === 0 && seedProducts.length > 0) {
    seedPromises.push(Product.insertMany(seedProducts.map(p => ({ ...p, _id: p.id }))));
    console.log('Seeded products collection');
  }

  if (softwareCount === 0 && seedSoftwareProducts.length > 0) {
    seedPromises.push(SoftwareProduct.insertMany(seedSoftwareProducts.map(p => ({ ...p, _id: p.id }))));
    console.log('Seeded software products collection');
  }

  if (blogCount === 0 && seedBlogPosts.length > 0) {
    seedPromises.push(BlogPost.insertMany(seedBlogPosts.map(p => ({ ...p, _id: p.id }))));
    console.log('Seeded blog posts collection');
  }

  if (jobCount === 0 && seedJobOpenings.length > 0) {
    seedPromises.push(JobOpening.insertMany(seedJobOpenings.map(j => ({ ...j, _id: j.id }))));
    console.log('Seeded job openings collection');
  }

  if (userCount === 0 && seedUsers.length > 0) {
    // Use save() for each user to ensure password hashing via pre-save hook
    const userSavePromises = seedUsers.map(async (u) => {
      const user = new User({ ...u, _id: u.id });
      return user.save();
    });
    seedPromises.push(Promise.all(userSavePromises));
    console.log('Seeded users collection');
  }

  if (orderCount === 0 && seedOrders.length > 0) {
    // For orders, we need to ensure the referenced products and users exist
    seedPromises.push(Order.insertMany(seedOrders.map(o => ({ ...o, _id: o.id }))));
    console.log('Seeded orders collection');
  }

  await Promise.all(seedPromises);
  console.log('Database initialization complete');
};
