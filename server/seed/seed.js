require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Post = require("../models/Post");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const usersData = [
  { name: "Ritesh", email: "test1@mail.com" },
  { name: "Rohit", email: "rohit@mail.com" },
  { name: "Alok", email: "alok@mail.com" },
  { name: "Sujit", email: "sujit@mail.com" },
  { name: "Pawan", email: "pawan@mail.com" }
];

const categories = ["Technology", "Lifestyle", "Business", "Health"];

const sampleContent = `
<p>This is a sample blog post created for seed data.</p>
<p>It demonstrates rich text content usage.</p>
`;

const seedDatabase = async () => {
  try {
    await connectDB();

    const SEED_MODE = process.env.SEED_MODE || "reset";

    if (SEED_MODE === "reset") {
      console.log("Resetting database...");
      await User.deleteMany();
      await Post.deleteMany();
    } else {
      console.log("Appending seed data...");
    }

    console.log("Creating users...");
    const passwordHash = await bcrypt.hash("password123", 10);

    const users = await User.insertMany(
      usersData.map(user => ({
        ...user,
        password: passwordHash
      }))
    );

    console.log("Creating posts...");
    const posts = [];

    for (let i = 0; i < 15; i++) {
      const author = users[i % users.length];
      const category = categories[i % categories.length];
      const isDraft = false;

      posts.push({
        title: `Sample Blog Post ${i + 1}`,
        content: sampleContent,
        category,
        author: author._id,
        status: "published",
        image: "/uploads/seed-placeholder.png"
      });

    }

    await Post.insertMany(posts);

    console.log("Seed data created successfully");
    process.exit();
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

seedDatabase();
