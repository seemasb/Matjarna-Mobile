import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LogIn from './com/matjarna/login';
import Splash from './com/matjarna/splashScreen';
import HomePage from './com/matjarna/homePage';
import SplashScreen from 'react-native-splash-screen';
import SignUp from './com/matjarna/signup';
import {useTranslation} from 'react-i18next';
import CustomSidebarMenu from './com/matjarna/components/customSidebarMenu';
import Profile from './com/matjarna/profilePage';
import Products from './com/matjarna/products';
import Search from './com/matjarna/search';
import {Provider} from 'react-redux';
import {store} from './com/matjarna/stores/store';
import i18n from './com/matjarna/i18n/config';
import {changeLanguage} from './com/matjarna/commons/methods';
import WebView from './com/matjarna/webView';
import ProductDetails from './com/matjarna/productDetails';

const NAVIGATE_PRIVACY_POLICY = 'privacyPolicy';
const NAVIGATE_TERMS_AND_CONDITIONS = 'termsAndConditions';

const Drawer = createDrawerNavigator();

function DrawerMenu() {
  const {t} = useTranslation();
  return (
    <Drawer.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '100%',
        },
      }}
      backBehavior="initialRoute"
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="editProfile"
        component={Profile}
        options={{
          groupName: t('sideMenu.general'),
          drawerLabel: t('sideMenu.editProfile'),
        }}
      />

      <Drawer.Screen
        name="language"
        component={HomePage}
        options={{
          groupName: t('sideMenu.general'),
          drawerLabel: t('sideMenu.changeLanguage'),
        }}
        listeners={() => ({
          state: _ => {
            i18n.language == 'ar' ? changeLanguage('en') : changeLanguage('ar');
          },
        })}
      />
      <Drawer.Screen
        name="termsAndConditions"
        component={WebView}
        options={{
          groupName: t('sideMenu.legal'),
          drawerLabel: t('sideMenu.terms'),
        }}
        initialParams={{
          url: NAVIGATE_TERMS_AND_CONDITIONS,
        }}
      />
      <Drawer.Screen
        name="privacyPolicy"
        component={WebView}
        options={{
          groupName: t('sideMenu.legal'),
          drawerLabel: t('sideMenu.privacyPolicy'),
        }}
        initialParams={{
          url: NAVIGATE_PRIVACY_POLICY,
        }}
      />
      <Drawer.Screen
        name="logout"
        component={LogIn}
        options={{
          groupName: t('sideMenu.personal'),
          drawerLabel: t('sideMenu.logout'),
        }}
        listeners={({navigation}) => ({
          state: _ => {
            navigation.replace('login');
          },
        })}
      />
      <Drawer.Screen name="home" component={HomePage} />
    </Drawer.Navigator>
  );
}

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  const onNavigationReady = () => {
    SplashScreen.hide();
  };

  return (
    <Provider store={store}>
    <NavigationContainer onReady={onNavigationReady}>
      <Stack.Navigator initialRouteName="splash">
        <Stack.Screen
          name="splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="login"
          component={LogIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="drawer"
          component={DrawerMenu}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="products"
          component={Products}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="productDetails"
          component={ProductDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="search"
          component={Search}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

export default App;
