import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { 
  Clock, 
  BookOpen, 
  BarChart2, 
  Award, 
  ChevronRight 
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function ExamGuideScreen() {
  const { exam } = useLocalSearchParams<{ exam: 'SAT' | 'ACT' }>();
  const router = useRouter();

  const isSAT = exam === 'SAT';

  return (
    <>
      <Stack.Screen
        options={{
          title: `${exam} Exam Guide`,
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{exam} Exam Guide</Text>
          <Text style={styles.subtitle}>
            {isSAT
              ? 'Everything you need to know about the SAT'
              : 'Everything you need to know about the ACT'}
          </Text>
        </View>

        <Image
          source={{
            uri: isSAT
              ? 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Exam Structure</Text>
          </View>

          {isSAT ? (
            <View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Reading</Text>
                <Text style={styles.examSectionDetails}>
                  • 65 minutes
                  {'\n'}• 52 questions
                  {'\n'}• 5 passages
                </Text>
              </View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Writing</Text>
                <Text style={styles.examSectionDetails}>
                  • 35 minutes
                  {'\n'}• 44 questions
                  {'\n'}• 4 passages
                </Text>
              </View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Math (No Calculator)</Text>
                <Text style={styles.examSectionDetails}>
                  • 25 minutes
                  {'\n'}• 20 questions (15 multiple choice, 5 grid-in)
                </Text>
              </View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Math (Calculator)</Text>
                <Text style={styles.examSectionDetails}>
                  • 55 minutes
                  {'\n'}• 38 questions (30 multiple choice, 8 grid-in)
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>English</Text>
                <Text style={styles.examSectionDetails}>
                  • 45 minutes
                  {'\n'}• 75 questions
                  {'\n'}• 5 passages
                </Text>
              </View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Math</Text>
                <Text style={styles.examSectionDetails}>
                  • 60 minutes
                  {'\n'}• 60 questions
                </Text>
              </View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Reading</Text>
                <Text style={styles.examSectionDetails}>
                  • 35 minutes
                  {'\n'}• 40 questions
                  {'\n'}• 4 passages
                </Text>
              </View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Science</Text>
                <Text style={styles.examSectionDetails}>
                  • 35 minutes
                  {'\n'}• 40 questions
                  {'\n'}• 6-7 passages
                </Text>
              </View>
              <View style={styles.examSection}>
                <Text style={styles.examSectionTitle}>Writing (Optional)</Text>
                <Text style={styles.examSectionDetails}>
                  • 40 minutes
                  {'\n'}• 1 essay
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart2 size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Scoring</Text>
          </View>

          {isSAT ? (
            <Text style={styles.sectionContent}>
              The SAT is scored on a scale of 400-1600:
              {'\n\n'}• Evidence-Based Reading and Writing: 200-800
              {'\n'}• Math: 200-800
              {'\n\n'}Each section is first scored as a raw score (number of correct answers), then converted to a scaled score.
              {'\n\n'}There is no penalty for wrong answers, so always guess if you&apos;re unsure!
            </Text>
          ) : (
            <Text style={styles.sectionContent}>
              The ACT is scored on a scale of 1-36:
              {'\n\n'}• English: 1-36
              {'\n'}• Math: 1-36
              {'\n'}• Reading: 1-36
              {'\n'}• Science: 1-36
              {'\n\n'}Your composite score is the average of these four sections.
              {'\n\n'}The optional Writing section is scored separately on a scale of 2-12.
              {'\n\n'}There is no penalty for wrong answers, so always guess if you&apos;re unsure!
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Target Scores</Text>
          </View>

          <Text style={styles.sectionContent}>
            {isSAT ? (
              <>
                Competitive scores vary by college, but here&apos;s a general guide:
                {'\n\n'}• 1500-1600: Highly selective schools (Ivy League, Stanford, MIT)
                {'\n'}• 1400-1490: Very selective schools (Top 25 universities)
                {'\n'}• 1300-1390: Selective schools (Top 50 universities)
                {'\n'}• 1200-1290: Many quality universities
                {'\n'}• 1100-1190: Average score range (50th percentile)
                {'\n\n'}The national average SAT score is around 1050.
              </>
            ) : (
              <>
                Competitive scores vary by college, but here&apos;s a general guide:
                {'\n\n'}• 33-36: Highly selective schools (Ivy League, Stanford, MIT)
                {'\n'}• 30-32: Very selective schools (Top 25 universities)
                {'\n'}• 27-29: Selective schools (Top 50 universities)
                {'\n'}• 24-26: Many quality universities
                {'\n'}• 20-23: Average score range (50th percentile)
                {'\n\n'}The national average ACT score is around 21.
              </>
            )}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Key Strategies</Text>
          </View>

          <TouchableOpacity
            style={styles.strategyCard}
            onPress={() => router.push({
              pathname: '/testprep/category',
              params: { category: 'time-management' },
            })}
          >
            <View style={styles.strategyContent}>
              <Text style={styles.strategyTitle}>Time Management</Text>
              <Text style={styles.strategyDescription}>
                Learn how to allocate your time effectively during the exam
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.strategyCard}
            onPress={() => router.push({
              pathname: '/testprep/category',
              params: { category: 'elimination-strategies' },
            })}
          >
            <View style={styles.strategyContent}>
              <Text style={styles.strategyTitle}>Answer Elimination</Text>
              <Text style={styles.strategyDescription}>
                Techniques to eliminate wrong answers quickly
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.strategyCard}
            onPress={() => router.push({
              pathname: '/testprep/category',
              params: { category: 'stress-reduction' },
            })}
          >
            <View style={styles.strategyContent}>
              <Text style={styles.strategyTitle}>Stress Management</Text>
              <Text style={styles.strategyDescription}>
                Techniques to stay calm and focused during the test
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.primary} />
          </TouchableOpacity>

          {isSAT ? (
            <>
              <TouchableOpacity
                style={styles.strategyCard}
                onPress={() => router.push({
                  pathname: '/testprep/category',
                  params: { category: 'reading-strategies' },
                })}
              >
                <View style={styles.strategyContent}>
                  <Text style={styles.strategyTitle}>Reading Strategies</Text>
                  <Text style={styles.strategyDescription}>
                    Effective approaches for the SAT Reading section
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.strategyCard}
                onPress={() => router.push({
                  pathname: '/testprep/category',
                  params: { category: 'math-formulas' },
                })}
              >
                <View style={styles.strategyContent}>
                  <Text style={styles.strategyTitle}>Math Formulas</Text>
                  <Text style={styles.strategyDescription}>
                    Essential formulas to memorize for the SAT Math sections
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.strategyCard}
                onPress={() => router.push({
                  pathname: '/testprep/category',
                  params: { category: 'science-strategies' },
                })}
              >
                <View style={styles.strategyContent}>
                  <Text style={styles.strategyTitle}>Science Strategies</Text>
                  <Text style={styles.strategyDescription}>
                    How to tackle the ACT Science section effectively
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.strategyCard}
                onPress={() => router.push({
                  pathname: '/testprep/category',
                  params: { category: 'grammar-rules' },
                })}
              >
                <View style={styles.strategyContent}>
                  <Text style={styles.strategyTitle}>Grammar Rules</Text>
                  <Text style={styles.strategyDescription}>
                    Key grammar rules for the ACT English section
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => router.push({
            pathname: isSAT ? '/tests/details' : '/tests/details',
            params: { id: isSAT ? 'sat-1' : 'act-1' },
          })}
        >
          <Text style={styles.practiceButtonText}>
            Take a Practice {exam} Test
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  examSection: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  examSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  examSectionDetails: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  strategyCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strategyContent: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  strategyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  practiceButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  practiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});