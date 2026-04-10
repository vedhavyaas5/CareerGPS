import mongoose from 'mongoose';
import 'dotenv/config';
import Simulation from '../models/Simulation.js';
import Skill from '../models/Skill.js';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careergps');

    // Clear existing data
    await Simulation.deleteMany({});
    await Skill.deleteMany({});

    // Sample Simulations
    const simulations = [
      {
        title: 'UI Designer Challenge',
        description: 'Design a mobile app interface for a task management tool',
        category: 'design',
        difficulty: 'beginner',
        duration: 15,
        objectives: ['Understand user needs', 'Create wireframes', 'Design system'],
        skillsTagged: ['UI Design', 'User Research', 'Prototyping'],
        icon: '🎨',
        content: {
          intro: 'You are a junior UI designer tasked with creating a beautiful and functional interface.',
          tasks: [
            {
              taskId: 'task-1',
              title: 'User Research',
              description: 'Interview 3 users to understand their needs',
              expectedOutcome: 'List of user pain points',
            },
            {
              taskId: 'task-2',
              title: 'Wireframing',
              description: 'Create low-fidelity wireframes',
              expectedOutcome: 'Sketches or digital wireframes',
            },
            {
              taskId: 'task-3',
              title: 'High-Fidelity Design',
              description: 'Create a polished UI mockup',
              expectedOutcome: 'Professional design file',
            },
          ],
        },
      },
      {
        title: 'AI Engineer Task',
        description: 'Build a simple machine learning model to predict student grades',
        category: 'tech',
        difficulty: 'advanced',
        duration: 20,
        objectives: ['Data preprocessing', 'Model training', 'Evaluation'],
        skillsTagged: ['Machine Learning', 'Python', 'Data Analysis'],
        icon: '🤖',
        content: {
          intro: 'You are an AI engineer building a predictive model.',
          tasks: [
            {
              taskId: 'task-1',
              title: 'Data Preparation',
              description: 'Clean and prepare student data',
              expectedOutcome: 'Clean dataset',
            },
            {
              taskId: 'task-2',
              title: 'Model Building',
              description: 'Train a linear regression model',
              expectedOutcome: 'Trained model',
            },
            {
              taskId: 'task-3',
              title: 'Evaluation',
              description: 'Evaluate model accuracy and metrics',
              expectedOutcome: 'Performance report',
            },
          ],
        },
      },
      {
        title: 'Business Strategist Challenge',
        description: 'Create a go-to-market strategy for a new product',
        category: 'business',
        difficulty: 'intermediate',
        duration: 18,
        objectives: ['Market analysis', 'Strategy planning', 'Presentation'],
        skillsTagged: ['Strategic Thinking', 'Business Planning', 'Communication'],
        icon: '📊',
        content: {
          intro: 'You are a business strategist launching a new EdTech product.',
          tasks: [
            {
              taskId: 'task-1',
              title: 'Market Research',
              description: 'Analyze target market and competitors',
              expectedOutcome: 'Market analysis report',
            },
            {
              taskId: 'task-2',
              title: 'Strategy Development',
              description: 'Create a GTM strategy',
              expectedOutcome: 'Strategy document',
            },
            {
              taskId: 'task-3',
              title: 'Pitch Preparation',
              description: 'Create a 5-minute pitch deck',
              expectedOutcome: 'Pitch presentation',
            },
          ],
        },
      },
      {
        title: 'Medical Diagnostician Mini Task',
        description: 'Analyze patient symptoms and suggest potential diagnoses',
        category: 'healthcare',
        difficulty: 'intermediate',
        duration: 12,
        objectives: ['Clinical reasoning', 'Research', 'Decision making'],
        skillsTagged: ['Medical Knowledge', 'Problem Solving', 'Research'],
        icon: '⚕️',
        content: {
          intro: 'You are a medical intern analyzing patient cases.',
          tasks: [
            {
              taskId: 'task-1',
              title: 'Symptom Analysis',
              description: 'Study patient symptoms and history',
              expectedOutcome: 'Symptom summary',
            },
            {
              taskId: 'task-2',
              title: 'Differential Diagnosis',
              description: 'List possible diagnoses',
              expectedOutcome: 'Diagnosis list',
            },
          ],
        },
      },
      {
        title: 'Content Creator Project',
        description: 'Create a viral social media campaign for a brand',
        category: 'creative',
        difficulty: 'beginner',
        duration: 14,
        objectives: ['Content planning', 'Creativity', 'Analytics'],
        skillsTagged: ['Content Creation', 'Social Media', 'Creativity'],
        icon: '✨',
        content: {
          intro: 'You are a content creator for a lifestyle brand.',
          tasks: [
            {
              taskId: 'task-1',
              title: 'Campaign Concept',
              description: 'Develop a campaign idea',
              expectedOutcome: 'Campaign outline',
            },
            {
              taskId: 'task-2',
              title: 'Content Creation',
              description: 'Create sample content pieces',
              expectedOutcome: 'Social media posts',
            },
          ],
        },
      },
    ];

    // Sample Skills
    const skills = [
      { name: 'UI Design', category: 'design', level: 'beginner', relatedCareers: ['UX Designer', 'UI Designer', 'Product Designer'] },
      { name: 'User Research', category: 'design', level: 'intermediate', relatedCareers: ['UX Researcher', 'Product Manager'] },
      { name: 'Prototyping', category: 'design', level: 'intermediate', relatedCareers: ['Product Designer', 'UX Designer'] },
      { name: 'Machine Learning', category: 'tech', level: 'advanced', relatedCareers: ['ML Engineer', 'AI Researcher', 'Data Scientist'] },
      { name: 'Python', category: 'tech', level: 'intermediate', relatedCareers: ['Software Engineer', 'Data Scientist', 'Backend Developer'] },
      { name: 'Data Analysis', category: 'tech', level: 'intermediate', relatedCareers: ['Data Analyst', 'Data Scientist', 'Business Analyst'] },
      { name: 'Strategic Thinking', category: 'business', level: 'intermediate', relatedCareers: ['Strategy Consultant', 'Product Manager', 'Business Analyst'] },
      { name: 'Business Planning', category: 'business', level: 'intermediate', relatedCareers: ['Entrepreneur', 'Business Manager', 'Consultant'] },
      { name: 'Communication', category: 'business', level: 'beginner', relatedCareers: ['Sales Manager', 'Product Manager', 'Scrum Master'] },
      { name: 'Medical Knowledge', category: 'healthcare', level: 'advanced', relatedCareers: ['Doctor', 'Surgeon', 'Medical Researcher'] },
      { name: 'Problem Solving', category: 'tech', level: 'intermediate', relatedCareers: ['Software Engineer', 'Data Scientist', 'Product Manager'] },
      { name: 'Research', category: 'tech', level: 'intermediate', relatedCareers: ['Researcher', 'Scientist', 'Data Analyst'] },
      { name: 'Content Creation', category: 'creative', level: 'beginner', relatedCareers: ['Content Creator', 'Copywriter', 'Marketing Manager'] },
      { name: 'Social Media', category: 'creative', level: 'beginner', relatedCareers: ['Social Media Manager', 'Digital Marketer', 'Content Creator'] },
      { name: 'Creativity', category: 'creative', level: 'beginner', relatedCareers: ['Artist', 'Designer', 'Creative Director'] },
    ];

    await Simulation.insertMany(simulations);
    await Skill.insertMany(skills);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
