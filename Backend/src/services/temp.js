const resume = `MICHAEL ANDERSON

Email: [michael.anderson@example.com](mailto:michael.anderson@example.com)
Phone: +1 555-123-4567
Location: Austin, Texas
LinkedIn: linkedin.com/in/michaelanderson
GitHub: github.com/michaelanderson

PROFESSIONAL SUMMARY

Software Engineer with 5 years of experience building scalable web applications and cloud-native services. Skilled in full-stack development using JavaScript, TypeScript, React, Node.js, and AWS. Proven track record of improving application performance, leading feature development, and collaborating with cross-functional teams to deliver high-impact products.

TECHNICAL SKILLS

Languages:
JavaScript, TypeScript, Python, Java, SQL

Frontend:
React, Next.js, Redux, HTML5, CSS3, Tailwind CSS

Backend:
Node.js, Express.js, NestJS

Databases:
MongoDB, PostgreSQL, MySQL, Redis

Cloud & DevOps:
AWS EC2, AWS S3, AWS Lambda, Docker, Kubernetes, GitHub Actions

Tools:
Git, Postman, Jira, Linux

WORK EXPERIENCE

Senior Software Engineer
TechFlow Solutions
March 2023 - Present

* Led development of a customer analytics platform serving over 100,000 monthly users.
* Designed REST APIs using Node.js and Express, reducing response latency by 35%.
* Migrated legacy frontend architecture to React and TypeScript, improving maintainability.
* Built CI/CD pipelines using GitHub Actions and Docker.
* Mentored three junior developers and conducted code reviews.

Software Engineer
CloudBridge Technologies
July 2020 - February 2023

* Developed scalable microservices using Node.js and PostgreSQL.
* Implemented JWT authentication and role-based access control.
* Optimized database queries, reducing average execution time by 40%.
* Integrated third-party payment gateways and notification systems.
* Collaborated with product managers and designers in Agile sprints.

PROJECTS

AI Interview Coach

* Built an AI-powered interview preparation platform using React, Node.js, and OpenAI APIs.
* Generated personalized interview questions based on resumes and job descriptions.
* Achieved 92% positive user feedback during beta testing.

E-Commerce Analytics Dashboard

* Developed real-time dashboards using React and Chart.js.
* Processed over 1 million transaction records for business insights.
* Implemented caching with Redis to improve dashboard performance.

Cloud File Sharing Platform

* Built secure file upload and sharing functionality using AWS S3.
* Added user authentication and permission management.
* Supported over 50GB of uploaded content during testing.

EDUCATION

Bachelor of Science in Computer Science
University of Texas at Austin
2016 - 2020

CERTIFICATIONS

* AWS Certified Developer Associate
* Docker Certified Associate

ACHIEVEMENTS

* Employee of the Quarter (2024)
* Led migration project that reduced infrastructure costs by 22%
* Speaker at local JavaScript and Cloud Computing meetups
`

const jobDescription = `Position: Software Engineer II (Backend & Platform)

Location: Remote

About the Role

We are seeking a Software Engineer II to join our Platform Engineering team. You will design, develop, and maintain scalable backend services that power mission-critical applications used by millions of customers worldwide.

Responsibilities

* Design and implement scalable backend services and APIs.
* Develop microservices using Go and Node.js.
* Build and maintain distributed systems with high availability and fault tolerance.
* Collaborate with product managers, designers, and engineers to deliver new features.
* Improve system reliability, observability, and performance.
* Participate in architecture discussions and technical planning.
* Write clean, maintainable, and testable code.
* Conduct code reviews and mentor junior engineers.

Required Qualifications

* 3+ years of software engineering experience.
* Strong programming skills in Go, Java, Python, or Node.js.
* Experience with distributed systems and microservice architectures.
* Strong understanding of system design principles.
* Experience with Kubernetes and container orchestration.
* Experience with PostgreSQL and NoSQL databases.
* Familiarity with cloud platforms such as AWS, GCP, or Azure.
* Knowledge of CI/CD pipelines and DevOps practices.
* Strong problem-solving and communication skills.

Preferred Qualifications

* Experience working with event-driven architectures.
* Familiarity with Kafka or message queue systems.
* Experience with infrastructure as code tools such as Terraform.
* Knowledge of monitoring and observability tools.
* Experience building large-scale systems serving millions of users.
`
const selfDescription = `I am a software engineer with over five years of experience building full-stack web applications and cloud-native systems. My strengths lie in backend architecture, API development, database optimization, and scalable application design. I enjoy solving complex technical challenges and collaborating with cross-functional teams to deliver impactful products.

Throughout my career, I have worked extensively with JavaScript, TypeScript, React, Node.js, PostgreSQL, MongoDB, Docker, and AWS. I have led feature development, mentored junior engineers, and contributed to architectural decisions for production systems serving thousands of users.

I am currently looking for opportunities where I can contribute to large-scale distributed systems, improve my system design expertise, and work on products that leverage cloud infrastructure and modern engineering practices. I am particularly interested in companies that value innovation, ownership, and continuous learning.
`

module.exports = {
    resume,
    selfDescription,
    jobDescription
}