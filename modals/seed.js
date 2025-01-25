const mongoose = require("mongoose");
const Blogger = require("./data.js");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

const blogs = [
  {
    bloggername: "Deepak",
    blogname: "Travel Blog",
    description:
      "Discover hidden gems across the globe with our travel tips and destination guides. From bustling cities to serene landscapes, embark on unforgettable adventures. Explore local cuisines, cultural landmarks, and insider secrets to make the most of your journey. Let your wanderlust lead the way!",
    author: "66874e2d80545454e307e2ba",
  },
  {
    bloggername: "Suresh",
    blogname: "Tech Blog",
    description:
      "Stay ahead in the tech world with our in-depth reviews and latest updates. From groundbreaking gadgets to innovative software, we cover everything you need to know. Discover tips, trends, and tutorials to enhance your digital experience. Join the tech-savvy community today!",
  },
  {
    bloggername: "mahesh",
    blogname: "Food Blog",
    description:
      "Indulge in culinary delights with our diverse recipes and cooking tips. From gourmet dishes to easy weeknight meals, find inspiration for every occasion. Explore global flavors, cooking techniques, and food trends. Elevate your kitchen game and satisfy your taste buds!",
  },
  {
    bloggername: "Naresh",
    blogname: "Fashion blog",
    description:
      "Stay stylish with the latest fashion trends and style tips. Discover outfit inspirations, designer highlights, and beauty hacks to elevate your look. From streetwear to haute couture, keep your wardrobe updated. Unleash your inner fashionista and shine with confidence!",
  },
];

Blogger.insertMany(blogs)

  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
