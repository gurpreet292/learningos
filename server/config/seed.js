const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

const coursesSeed = [
  {
    title: 'HTML Fundamentals',
    description: 'Learn how the structure of the web works and build accessible, semantic content.',
    category: 'HTML',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
    lessons: [
      { title: 'Introduction', content: 'HTML is the language that structures web pages. It creates headings, paragraphs, lists, forms, and more.', explanation: 'Every modern page starts with HTML. It defines the meaning and structure of the content.', codeExample: '<h1>Hello, LearningOS!</h1>\n<p>Welcome to web development.</p>', tryItYourself: 'Create a small page with a heading and a paragraph.', practiceTask: 'Write an HTML snippet that displays your name and a short introduction.', order: 1 },
      { title: 'Tags', content: 'Tags define the type of content on a page. They are the building blocks of markup.', explanation: 'Tags always use angle brackets and usually come in pairs. Opening tags and closing tags wrap content.', codeExample: '<p>This is a paragraph.</p>\n<strong>Important text</strong>', tryItYourself: 'Use bold and emphasis tags together.', practiceTask: 'Create a list of 3 skills using HTML tags.', order: 2 },
      { title: 'Elements', content: 'An HTML element includes a tag, optional attributes, and the content inside it.', explanation: 'Understanding elements helps you reason about structure and layout in a page.', codeExample: '<div class="card">\n  <h2>Card title</h2>\n  <p>Card description</p>\n</div>', tryItYourself: 'Create a card with a title and paragraph.', practiceTask: 'Build a basic product card using a div, heading, and paragraph.', order: 3 },
      { title: 'Attributes', content: 'Attributes provide extra information about an element such as classes, IDs, links, and alt text.', explanation: 'Attributes help you style and access elements with CSS and JavaScript.', codeExample: '<img src="image.png" alt="A workspace desk" width="300">\n<a href="https://example.com" target="_blank">Visit</a>', tryItYourself: 'Add attributes to a link and image.', practiceTask: 'Create a button link with a URL and a descriptive label.', order: 4 },
      { title: 'Lists', content: 'Lists help organize related content in ordered and unordered forms.', explanation: 'Use <ul> for bullet lists and <ol> for numbered items.', codeExample: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>', tryItYourself: 'Create a shopping list using HTML.', practiceTask: 'Write a list of 5 learning goals.', order: 5 },
      { title: 'Tables', content: 'Tables help present data in rows and columns.', explanation: 'Tables are useful for schedules, comparison data, and reports.', codeExample: '<table>\n  <tr><th>Name</th><th>Score</th></tr>\n  <tr><td>Ada</td><td>98</td></tr>\n</table>', tryItYourself: 'Build a simple attendance table.', practiceTask: 'Create a table with three students and three scores.', order: 6 },
      { title: 'Forms', content: 'Forms collect user input using fields like text, email, password, and buttons.', explanation: 'The <form> element groups inputs and sends data to a server.', codeExample: '<form>\n  <input type="text" placeholder="Full name">\n  <button type="submit">Submit</button>\n</form>', tryItYourself: 'Create a form with a name field and submit button.', practiceTask: 'Build a sign-up form with email and password fields.', order: 7 },
      { title: 'Semantic HTML', content: 'Semantic elements describe the meaning of content for accessibility and SEO.', explanation: 'Instead of only using divs everywhere, use sections, articles, headers, and footers to structure pages more clearly.', codeExample: '<header>\n  <nav>Home</nav>\n</header>\n<main>\n  <article>Content</article>\n</main>', tryItYourself: 'Build a basic semantic layout with header and main sections.', practiceTask: 'Structure a page using header, nav, main, and footer.', order: 8 },
      { title: 'HTML Quiz', content: 'Check your understanding of the fundamental concepts you just learned.', explanation: 'This quick quiz reviews semantic HTML, tags, forms, and layout basics.', codeExample: 'Quiz time: answer each question to measure your learning.', tryItYourself: 'Review each answer before submitting.', practiceTask: 'Submit the quiz to earn your HTML progress update.', order: 9, isQuiz: true },
    ],
    quiz: [
      { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HighText Marketing Language', 'Home Tool Markup Language'], answer: 'HyperText Markup Language' },
      { question: 'Which tag creates the largest heading?', options: ['<h6>', '<h1>', '<header>'], answer: '<h1>' },
      { question: 'Which HTML element is used for a list item?', options: ['<li>', '<ul>', '<list>'], answer: '<li>' },
      { question: 'What is the purpose of the alt attribute on an image?', options: ['Stores image color', 'Provides alternative text for accessibility', 'Changes the image size'], answer: 'Provides alternative text for accessibility' },
    ]
  },
  {
    title: 'CSS Mastery',
    description: 'Style websites beautifully with layout systems, color, spacing, and responsive rules.',
    category: 'CSS',
    thumbnail: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
    lessons: [
      { title: 'Selectors', content: 'Selectors tell the browser which elements to target for styling.', explanation: 'You can target tags, classes, IDs, and attributes to apply styles precisely.', codeExample: '.button {\n  background: #17c6d8;\n  color: white;\n}', tryItYourself: 'Style a class selector for a button.', practiceTask: 'Create a CSS selector that colors all headings blue.', order: 1 },
      { title: 'Box Model', content: 'Every element is made of content, padding, border, and margin.', explanation: 'The box model controls how an element occupies space on the page.', codeExample: '.card {\n  padding: 20px;\n  border: 1px solid #d1d5db;\n  margin: 16px;\n}', tryItYourself: 'Create a card with padding and margin.', practiceTask: 'Build a card with 24px padding and 12px border radius.', order: 2 },
      { title: 'Flexbox', content: 'Flexbox makes it easy to align and distribute items in rows and columns.', explanation: 'It is ideal for navbars, cards, and layout alignment.', codeExample: '.row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}', tryItYourself: 'Create a horizontal row with 3 cards.', practiceTask: 'Use Flexbox to align three items in the center.', order: 3 },
      { title: 'Grid', content: 'CSS Grid is excellent for two-dimensional layouts with columns and rows.', explanation: 'Grid helps build dashboards, portfolios, and product pages efficiently.', codeExample: '.layout {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n}', tryItYourself: 'Set up a two-column card grid.', practiceTask: 'Create a 3-column product grid with equal spacing.', order: 4 },
      { title: 'Animations', content: 'Animations make interface elements feel more alive and engaging.', explanation: 'Transitions and keyframes help create movement and feedback.', codeExample: '.button {\n  transition: transform 0.3s ease;\n}\n.button:hover { transform: translateY(-3px); }', tryItYourself: 'Add a hover animation to a button.', practiceTask: 'Create a hover effect that scales or lifts a card.', order: 5 },
      { title: 'Responsive Design', content: 'Responsive design adapts layouts to different screen sizes using media queries.', explanation: 'Modern applications must work on mobile, tablet, and desktop devices.', codeExample: '@media (max-width: 768px) {\n  .layout { grid-template-columns: 1fr; }\n}', tryItYourself: 'Write a media query for mobile layout.', practiceTask: 'Make a two-column layout become single-column on small screens.', order: 6 },
      { title: 'CSS Quiz', content: 'Review styling fundamentals, layout systems, and responsive principles.', explanation: 'This quiz checks your confidence with selectors, layout, and responsive CSS.', codeExample: 'Question set ready.', tryItYourself: 'Read each prompt carefully and submit your answers.', practiceTask: 'Complete the quiz to save your progress.', order: 7, isQuiz: true },
    ],
    quiz: [
      { question: 'Which CSS property controls spacing inside an element?', options: ['margin', 'padding', 'border'], answer: 'padding' },
      { question: 'Which layout system is best for aligning items in a row?', options: ['Grid', 'Flexbox', 'Float'], answer: 'Flexbox' },
      { question: 'What does a media query help you do?', options: ['Reduce file size', 'Create responsive designs', 'Hide content forever'], answer: 'Create responsive designs' },
      { question: 'Which selector targets a unique element by ID?', options: ['.card', '#hero', 'div'], answer: '#hero' },
    ]
  },
  {
    title: 'JavaScript Essentials',
    description: 'Understand logic, DOM manipulation, functions, and asynchronous behavior in JavaScript.',
    category: 'JavaScript',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=1200&q=80',
    lessons: [
      { title: 'Variables', content: 'Variables store values and allow you to manage data in your app.', explanation: 'Variables make your code dynamic and reusable.', codeExample: 'const name = "Ava";\nlet score = 10;\nscore += 5;', tryItYourself: 'Create variables for a student name and score.', practiceTask: 'Declare a variable for your favorite color and log it to the console.', order: 1 },
      { title: 'Functions', content: 'Functions let you group reusable code and call it when needed.', explanation: 'Functions reduce repetition and improve readability.', codeExample: 'function greet(name) {\n  return `Hello, ${name}`;\n}\nconsole.log(greet("Sam"));', tryItYourself: 'Write a function that adds two numbers.', practiceTask: 'Create a function that returns the square of a number.', order: 2 },
      { title: 'Arrays', content: 'Arrays store ordered lists of values.', explanation: 'Use arrays for collections such as tasks, scores, and products.', codeExample: 'const languages = ["HTML", "CSS", "JavaScript"];\nconsole.log(languages[0]);', tryItYourself: 'Create an array of 3 courses.', practiceTask: 'Write code to add a new item to an array.', order: 3 },
      { title: 'Objects', content: 'Objects store related data in key-value pairs.', explanation: 'Use objects to model real-world entities like a student or product.', codeExample: 'const student = { name: "Noah", level: "Beginner" };\nconsole.log(student.name);', tryItYourself: 'Make an object with your name and favorite language.', practiceTask: 'Create an object with at least three properties.', order: 4 },
      { title: 'DOM', content: 'The DOM allows JavaScript to read and update page content dynamically.', explanation: 'You can select elements and change text, attributes, or styles.', codeExample: 'const title = document.querySelector("h1");\ntitle.textContent = "Ready to learn";', tryItYourself: 'Change the text of a heading using JavaScript.', practiceTask: 'Select a button and change its label.', order: 5 },
      { title: 'Events', content: 'Events are actions like clicks, key presses, and form submissions.', explanation: 'Event listeners allow your app to respond to user actions.', codeExample: 'button.addEventListener("click", () => {\n  alert("Clicked!");\n});', tryItYourself: 'Attach a click event to a button.', practiceTask: 'Create a button that changes text when clicked.', order: 6 },
      { title: 'Async JavaScript', content: 'Asynchronous code helps you handle delays, requests, and waiting states.', explanation: 'Promises and async/await make it easier to work with time-based tasks.', codeExample: 'async function loadData() {\n  const response = await fetch("/api/hello");\n  return response.json();\n}', tryItYourself: 'Write an async function that loads data.', practiceTask: 'Use async/await to fetch data and log it.', order: 7 },
      { title: 'Fetch API', content: 'The Fetch API sends HTTP requests and parses JSON responses.', explanation: 'It is the most common approach to fetching data from APIs in JavaScript.', codeExample: 'fetch("https://api.example.com/users")\n  .then((res) => res.json())\n  .then((data) => console.log(data));', tryItYourself: 'Call a sample API and log the result.', practiceTask: 'Use fetch to retrieve a JSON list and display one item.', order: 8 },
      { title: 'JavaScript Quiz', content: 'Check how well you understand variables, functions, DOM, and async behavior.', explanation: 'This final quiz helps confirm your core JavaScript confidence.', codeExample: 'Final round ready.', tryItYourself: 'Answer the questions carefully before submitting.', practiceTask: 'Complete the quiz to finish the JavaScript track.', order: 9, isQuiz: true },
    ],
    quiz: [
      { question: 'Which keyword is used to declare a constant variable?', options: ['let', 'const', 'var'], answer: 'const' },
      { question: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Method', 'Dynamic Output Module'], answer: 'Document Object Model' },
      { question: 'Which method is used to fetch data asynchronously?', options: ['addEventListener', 'fetch', 'querySelector'], answer: 'fetch' },
      { question: 'What is the output of 2 + "2" in JavaScript?', options: ['4', '22', 'NaN'], answer: '22' },
    ]
  },
];

const seedCourses = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        await User.create({
          name: process.env.ADMIN_NAME || 'LearningOS Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        });
      }
    }

    if (adminEmail && !adminPassword) {
      console.warn('Admin account was not seeded because ADMIN_PASSWORD is not configured.');
    }

    /* Seed course content independently of optional admin provisioning. */
    const courseCount = await Course.countDocuments();
    if (courseCount > 0) {
      return;
    }

    for (const courseData of coursesSeed) {
      const course = await Course.create({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        thumbnail: courseData.thumbnail,
      });

      const createdLessons = [];

      for (const lesson of courseData.lessons) {
        const createdLesson = await Lesson.create({
          courseId: course._id,
          title: lesson.title,
          content: lesson.content,
          explanation: lesson.explanation,
          codeExample: lesson.codeExample,
          tryItYourself: lesson.tryItYourself,
          practiceTask: lesson.practiceTask,
          order: lesson.order,
          isQuiz: lesson.isQuiz || false,
        });

        createdLessons.push(createdLesson._id);

        if (lesson.isQuiz) {
          const lessonQuizzes = courseData.quiz || [];
          for (const quiz of lessonQuizzes) {
            await Quiz.create({
              lessonId: createdLesson._id,
              question: quiz.question,
              options: quiz.options,
              answer: quiz.answer,
            });
          }
        }
      }

      await Course.findByIdAndUpdate(course._id, { lessons: createdLessons });
    }

    console.log('Default LearningOS courses and lessons seeded successfully.');
  } catch (error) {
    console.warn('Course seed failed:', error.message);
  }
};

module.exports = { seedCourses };
