import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Checkbox,
  Snackbar,
  useTheme,
  HelperText,
  IconButton,
  Surface,
} from 'react-native-paper';
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../App';

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "हिन्दी", value: "hi" },
  { label: "తెలుగు", value: "te" }
];

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });
  const [language, setLanguage] = useState('en');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { setLoggedInUser } = useContext(AuthContext);
  const theme = useTheme();

  // Password Strength Meter
  function getPasswordStrength(pw) {
    if (!pw) return { label: '', color: '' };
    if (pw.length < 6) return { label: 'Weak', color: '#e53935' };
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.length >= 8) return { label: 'Strong', color: '#43a047' };
    return { label: 'Medium', color: '#fbc02d' };
  }
  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setLoggedInUser({
          ...user,
          role: userData.role || "student",
        });
        setSnackbar({ visible: true, message: 'Login successful!', error: false });
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      } else {
        setSnackbar({ visible: true, message: 'User data not found.', error: true });
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          setEmailError(errorMessage);
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          setEmailError(errorMessage);
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          setPasswordError(errorMessage);
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later or reset your password";
          setPasswordError(errorMessage);
          break;
        default:
          setSnackbar({ visible: true, message: errorMessage, error: true });
      }
    } finally {
      setLoading(false);
    }
  };

  // Cancel button handler
  const handleCancel = () => {
    navigation.goBack();
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Register navigation
  const handleRegister = () => {
    navigation.navigate('Signup');
  };

  // Support link
  const handleSupport = () => {
    navigation.navigate('Support');
  };

  // Language selector
  const renderLanguageSwitch = () => (
    <View style={styles.languageRow}>
      <Text style={styles.languageLabel}>Language:</Text>
      {LANGUAGES.map((lang, idx) => (
        <Button
          key={lang.value}
          mode={language === lang.value ? "contained" : "text"}
          compact
          style={[
            styles.languageButton,
            language === lang.value && { backgroundColor: theme.colors.primary }
          ]}
          labelStyle={{
            color: language === lang.value ? 'white' : theme.colors.primary,
            fontWeight: language === lang.value ? 'bold' : 'normal',
            fontSize: 13,
          }}
          onPress={() => setLanguage(lang.value)}
        >
          {lang.label}
        </Button>
      ))}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Top-level Header and Caption */}
          <Text style={styles.header}>Master of Alphabet</Text>
          <Text style={styles.caption}>National Level English Language Skills Competition</Text>
          <View style={styles.outerContainer}>
            <Surface style={styles.surface} elevation={5}>
              <View style={styles.avatarWrapper}>
                <Surface style={styles.avatarCircle} elevation={2}>
                  <IconButton icon="account-circle-outline" color={theme.colors.primary} size={54} />
                </Surface>
              </View>
              <Text style={styles.welcome}>Welcome Back!</Text>
              <Text style={styles.description}>Sign in to continue to your challenges</Text>
              <TextInput
                label="Username or Email"
                mode="outlined"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setEmailError('');
                }}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                error={!!emailError}
                left={<TextInput.Icon icon="email-outline" />}
              />
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
              <TextInput
                label="Password"
                mode="outlined"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setPasswordError('');
                }}
                style={styles.input}
                secureTextEntry={!showPassword}
                error={!!passwordError}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                    forceTextInputFocus={false}
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  />
                }
              />
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
              {!!password && (
                <View style={styles.strengthRow}>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    Password Strength: {passwordStrength.label}
                  </Text>
                </View>
              )}
              {/* Remember me and Forgot password row */}
              <View style={styles.optionsRow}>
                <View style={styles.rememberMeRow}>
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                    color={theme.colors.primary}
                    uncheckedColor="#999"
                  />
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </View>
                <Button
                  mode="text"
                  compact
                  style={styles.forgotButton}
                  labelStyle={{ color: theme.colors.primary, fontSize: 13 }}
                  onPress={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </View>
              {/* Sign In and Cancel on same row */}
              <View style={styles.actionRow}>
                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  style={[styles.button, { flex: 1, marginRight: 8 }]}
                  contentStyle={{ paddingVertical: 8 }}
                  labelStyle={{ fontWeight: "bold", fontSize: 18 }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={[styles.cancelButton, { flex: 1, marginLeft: 8 }]}
                  labelStyle={{ color: theme.colors.primary, fontWeight: "bold" }}
                  contentStyle={{ paddingVertical: 8 }}
                >
                  Cancel
                </Button>
              </View>
              {/* Registration prompt */}
              <View style={styles.bottomRow}>
                <Text style={styles.registerPrompt}>Don't have an account?</Text>
                <Button
                  mode="text"
                  compact
                  style={styles.registerButton}
                  labelStyle={{ color: theme.colors.primary, fontWeight: 'bold', fontSize: 15 }}
                  onPress={handleRegister}
                >
                  Register
                </Button>
              </View>
              <Button
                mode="text"
                compact
                style={styles.supportButton}
                labelStyle={{ color: "#607d8b", fontSize: 13 }}
                onPress={handleSupport}
              >
                Need help?
              </Button>
              {renderLanguageSwitch()}
            </Surface>
          </View>
        </ScrollView>
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          duration={2500}
          style={snackbar.error ? styles.snackbarError : styles.snackbarSuccess}
        >
          {snackbar.message}
        </Snackbar>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f3f6fa",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingBottom: 24,
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 32,
    letterSpacing: 0.5,
    marginBottom: 0,
  },
  caption: {
    fontSize: 15,
    color: "#607d8b",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 2,
    fontWeight: "600",
  },
  surface: {
    borderRadius: 22,
    padding: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 4,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  avatarCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#e3ecfa",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
    marginTop: 2,
    color: "#111",
  },
  description: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 0,
    fontWeight: "400",
  },
  input: {
    width: "100%",
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
    marginTop: 8,
  },
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#222",
    marginLeft: 2,
  },
  forgotButton: {
    marginLeft: 0,
    alignSelf: 'center',
  },
  button: {
    borderRadius: 10,
    backgroundColor: "#1976d2",
    elevation: 2,
  },
  cancelButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#1976d2",
    backgroundColor: "#f8fafd",
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  registerPrompt: {
    fontSize: 15,
    color: "#222",
    marginRight: 6,
  },
  registerButton: {
    marginVertical: 0,
    paddingVertical: 0,
    height: 22,
  },
  supportButton: {
    marginTop: 8,
    alignSelf: "center",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 2,
  },
  languageLabel: {
    fontSize: 13,
    color: "#444",
    marginRight: 8,
  },
  languageButton: {
    marginHorizontal: 2,
    borderRadius: 16,
    height: 30,
    minWidth: 36,
    paddingHorizontal: 8,
  },
  strengthRow: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 2,
    marginTop: -8,
  },
  strengthLabel: {
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 2,
  },
  snackbarError: {
    backgroundColor: "#e53935",
  },
  snackbarSuccess: {
    backgroundColor: "#43a047",
  },
});

export default LoginScreen;