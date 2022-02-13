const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 225,
    //match: /pattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true,
    // uppercase: true,
    trim: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          // Do some async work
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: "A course should have at least one tag.",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
});

// Classes
// Course

const Course = mongoose.model("Course", courseSchema);

// Now we can create object based on those class
async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    category: "Web",
    author: "Shiv",
    tags: ["frontend"],
    isPublished: true,
    price: 15.8
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course
    .find({ _id: '60a0c346bd2e6e252855ded9'})
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, price: 1 });
  console.log(courses[0].price);
}

async function updateCourse(id) {
  // Approach: query first
  // findById()
  // Modify its properties
  // save()
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "Shiv",
        isPublished: false,
      },
    },
    { new: true }
  );

  console.log(course);
}

async function removeCourse(id) {
  const result = await Course.deleteMany({ _id: id });
  // const course = await Course.findByIdAndRemove(id);
  console.log(result);
}

getCourses();
