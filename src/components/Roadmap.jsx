import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

const careerFields = [
  {
    category: 'Software Engineering',
    description: 'Architect scalable systems and innovative software solutions',
    skills: [
      'Full-stack Development: Developing both front-end and back-end portions of an application.',
      'Microservices Architecture: Designing applications as a collection of loosely coupled services.',
      'Performance Optimization: Enhancing the speed and efficiency of applications.',
      'Test-Driven Development: Writing tests before writing the minimal production code.'
    ],
    technologies: [
      'React: A JavaScript library for building user interfaces.',
      'Node.js: A JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
      'Docker: A platform for developing, shipping, and running applications in containers.',
      'Kubernetes: An open-source system for automating deployment, scaling, and operations of application containers.'
    ]
  },
  {
    category: 'Cybersecurity',
    description: 'Defend digital ecosystems against advanced persistent threats',
    skills: [
      'Penetration Testing: Simulating cyber attacks to test the security of a system.',
      'Incident Response: Preparing for and reacting to security breaches.',
      'Cryptography: Securing information through encryption techniques.',
      'Threat Hunting: Proactively searching for cyber threats that may have bypassed security measures.'
    ],
    technologies: [
      'Splunk: A platform for searching, monitoring, and analyzing machine-generated data.',
      'Wireshark: A network protocol analyzer for capturing and interactively browsing the traffic running on a computer network.',
      'SIEM Tools: Software products and services that provide real-time analysis of security alerts.',
      'Metasploit: A penetration testing framework that makes hacking simple.'
    ]
  },
  {
    category: 'Cloud Computing',
    description: 'Design resilient, scalable cloud infrastructure and migration strategies',
    skills: [
      'Cloud Migration: Moving applications and data from on-premises to the cloud.',
      'Hybrid Cloud Design: Combining on-premises infrastructure with cloud services.',
      'Cost Optimization: Reducing cloud costs through efficient resource management.',
      'Cloud-Native Development: Building applications specifically for cloud environments.'
    ],
    technologies: [
      'AWS: A comprehensive cloud platform offered by Amazon.',
      'Azure: Microsoft\'s cloud computing service for building, testing, deploying, and managing applications.',
      'GCP: Google Cloud Platform, a suite of cloud computing services.',
      'Terraform: An open-source infrastructure as code software tool.'
    ]
  },
  {
    category: 'Data Science',
    description: 'Transform complex data into actionable strategic insights',
    skills: [
      'Predictive Modeling: Using statistical techniques to predict future behavior.',
      'Deep Learning: A subset of machine learning using neural networks with many layers.',
      'Data Engineering: Designing, building, and maintaining the architecture for large-scale data processing.',
      'AI Ethics: Ensuring that AI systems are fair, accountable, and transparent.'
    ],
    technologies: [
      'Python: A programming language widely used in data science.',
      'TensorFlow: An open-source library for numerical computation and machine learning.',
      'Pandas: A software library for data manipulation and analysis.',
      'Jupyter: An open-source web application that allows you to create and share documents that contain live code.'
    ]
  },
  {
    category: 'DevOps',
    description: 'Streamline software delivery and operational excellence',
    skills: [
      'Advanced Automation: Automating repetitive tasks to improve efficiency.',
      'Cloud-Native Tools: Tools designed specifically for cloud environments.',
      'Site Reliability Engineering: Applying engineering principles to operations problems.',
      'Performance Engineering: Ensuring that applications perform well under expected load conditions.'
    ],
    technologies: [
      'Jenkins: An open-source automation server for building, deploying, and automating any project.',
      'Ansible: An open-source automation tool for configuring and managing computers.',
      'Prometheus: An open-source monitoring and alerting toolkit.',
      'ELK Stack: A collection of open-source products for searching, analyzing, and visualizing log data in real time.'
    ]
  },
  {
    category: 'AI & Machine Learning',
    description: 'Pioneer intelligent systems and cutting-edge algorithmic solutions',
    skills: [
      'Advanced Neural Networks: Developing complex neural networks for various applications.',
      'Generative AI: Creating models that can generate new, synthetic but realistic data.',
      'Reinforcement Learning: Training models to make a sequence of decisions.',
      'Ethical AI Development: Ensuring AI systems are developed responsibly and ethically.'
    ],
    technologies: [
      'PyTorch: An open-source machine learning library based on the Torch library.',
      'OpenAI: A company focused on developing friendly AI in a way that benefits humanity.',
      'Hugging Face: A technology company based in New York and Paris, developing AI technologies.',
      'GPT Models: Generative Pre-trained Transformer models for natural language processing.'
    ]
  }
];

const Roadmap = () => {
  return (
    <LinearGradient
      colors={['#6b2488', '#151537', '#1a2c6b']}
      locations={[0, 0.3, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Roadmaps</Text>
            <Text style={styles.subtitle}>Choose Your Career Path</Text>
          </View>

          <View style={styles.timelineContainer}>
            {careerFields.map((field, index) => (
              <View key={field.category} style={styles.timelineItem}>
                <View style={styles.timelineMarker}>
                  <View style={[styles.timelineDot, { 
                    backgroundColor: getColorForIndex(index) 
                  }]} />
                </View>
                <View style={styles.cardContainer}>
                  <View style={[styles.timelineContent, { 
                    borderLeftColor: getColorForIndex(index) 
                  }]}>
                    <Text style={styles.categoryTitle}>{field.category}</Text>
                    <Text style={styles.categoryDescription}>{field.description}</Text>

                    <View style={styles.sectionSeparator} />

                    <View style={styles.skillsSection}>
                      <Text style={styles.sectionTitle}>Key Skills</Text>
                      {field.skills.map((skill) => (
                        <View key={skill} style={styles.skillRow}>
                          <Text style={styles.skillDot}>•</Text>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.sectionSeparator} />

                    <View style={styles.technologiesSection}>
                      <Text style={styles.sectionTitle}>Core Technologies</Text>
                      <View style={styles.technologiesGrid}>
                        {field.technologies.map((tech) => (
                          <View key={tech} style={styles.techBadge}>
                            <Text style={styles.techBadgeText}>{tech.split(':')[0]}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.roadmapContainer}>
            <Text style={styles.roadmapTitle}>Career Evolution</Text>
            {[
              { stage: 'Foundations', description: 'Build core competencies and technical fundamentals' },
              { stage: 'Specialization', description: 'Deep dive into chosen technological domain' },
              { stage: 'Professional Growth', description: 'Develop advanced skills and industry recognition' },
              { stage: 'Leadership', description: 'Drive innovation and strategic technological initiatives' }
            ].map((path, index) => (
              <View key={path.stage} style={styles.evolutionStage}>
                <View style={[styles.stageNumberContainer, { 
                  backgroundColor: getColorForIndex(index) 
                }]}>
                  <Text style={styles.stageNumber}>{index + 1}</Text>
                </View>
                <View style={styles.stageDetails}>
                  <Text style={styles.stageTitle}>{path.stage}</Text>
                  <Text style={styles.stageDescription}>{path.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// Helper function to generate dynamic colors
const getColorForIndex = (index) => {
  const colors = [
    '#6b2488',  // Purple
    '#1a2c6b',  // Dark Blue
    '#151537',  // Navy
    '#2ecc71',  // Emerald Green
    '#e74c3c',  // Vibrant Red
    '#f39c12'   // Bright Orange
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#CC00FE',
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    letterSpacing: 1,
    marginTop: 8,
  },
  timelineContainer: {
    marginBottom: 30,
    borderLeftWidth: 2,
    borderLeftColor: '#2C2C2C',
    paddingLeft: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 30,
    position: 'relative',
  },
  timelineMarker: {
    width: 30,
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: -35,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#121212',
  },
  cardContainer: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timelineContent: {
    backgroundColor: '#2A264B',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 5,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  categoryDescription: {
    color: '#B0B0B0',
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#CC00FE',
    marginVertical: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillDot: {
    color: '#FFFFFF',
    marginRight: 10,
    fontSize: 18,
  },
  skillText: {
    color: '#B0B0B0',
    fontSize: 16,
    flex: 1,
  },
  technologiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  techBadge: {
    backgroundColor: '#CC00FE',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
  },
  techBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  roadmapContainer: {
    backgroundColor: 'rgba(8, 13, 21, 0.8)',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  roadmapTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  evolutionStage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  stageNumberContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  stageNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    width: 200, 
  },
  stageDescription: {
    color: '#B0B0B0',
    fontSize: 16,
    lineHeight: 22,
    width: 200, 
  },
});

export default Roadmap;