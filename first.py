from faker import Faker
import random
from pymongo import MongoClient

# Initialize Faker and MongoDB client
fake = Faker()
client = MongoClient("mongodb://127.0.0.1:27017/Blogger")  # Adjust the MongoDB connection string as needed
db = client.Blogger  # Replace with your database name
collection = db.bloggers  # Replace with your collection name

def generate_blog_post(topic):
    title_keywords = ['Guide', 'Tips', 'Tricks', 'How to', 'Tutorial', 'Review', 'Best', 'Top', 'Why', 'Secrets']
    title = f"{random.choice(title_keywords)} {topic}"
    introduction = fake.paragraph(nb_sentences=50)
    body = "\n".join([fake.paragraph(nb_sentences=500) for i in range(3)])  # Generates 3 paragraphs for the body
    conclusion = fake.paragraph(nb_sentences=10)
    author = fake.name()
    return {
        'bloggername': author,
        'blogname': title,
        'description': f"{introduction}\n\n{body}\n\n{conclusion}"
    }

# Generate multiple detailed blog posts and insert into MongoDB
number_of_posts = 20  # Adjust the number of posts as needed
topic = 'Data science'  # Adjust the topic as needed
detailed_blog_posts = [generate_blog_post(topic) for i in range(number_of_posts)]

# Insert the generated posts into MongoDB
result = collection.insert_many(detailed_blog_posts)
#print(f"Inserted {len(result.inserted_ids)} blog posts into MongoDB")


