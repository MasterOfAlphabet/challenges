import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: '620931661204-7loqbspmi5dsqf03hrrmq6l1ebcb7oor.apps.googleusercontent.com',
});

export { auth, GoogleSignin };
