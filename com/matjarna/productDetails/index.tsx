import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconButton from '../sharedComponents/iconButton';
import ShoppingCartIcon from '../assets/icons/shoppingCartIcon';
import ChevronLeftIcon from '../assets/icons/chevronLeftIcon';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import PrimaryButton from '../sharedComponents/primaryButton';
import {fetchProductDetails} from './api';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {Product, productMapper} from '../products/product';
import ErrorIcon from '../assets/icons/errorIcon';
import AlertMessage from '../sharedComponents/alertMessage';
import {
  NavigationProp,
  ParamListBase,
  useRoute,
} from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const ProductDetails = ({navigation}: HomeScreenProps) => {
  const {t, i18n} = useTranslation();
  const route = useRoute();
  const countryCode = useSelector((state: any) => state.location.countryCode);
  const [loading, setLoading] = useState<boolean>(true);
  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    const productId = (route.params as {productId?: any})?.productId;
    productDetails(productId);
  }, []);

  const productDetails = async (id: number) => {
    try {
      const response: any = await fetchProductDetails(
        id,
        i18n.language,
        countryCode,
      );
      if (response) {
        const transformedData: Product = productMapper(response);
        setProduct(transformedData);
      }
    } catch (error) {
      setIsErrorOccured(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderImage = ({item}: {item: string}) => (
    <SkeletonPlaceholder borderRadius={4} enabled={loading}>
      <Image source={{uri: item}} style={styles.image} />
    </SkeletonPlaceholder>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'dark-content'} backgroundColor="transparent" />
      <View style={styles.topBar}>
        <IconButton icon={<ChevronLeftIcon />} onPress={handleBackPress} />
        <IconButton icon={<ShoppingCartIcon />} />
      </View>

      {isErrorOccured && !loading && (
        <View style={styles.alertMessage}>
          <AlertMessage icon={<ErrorIcon />} message={t('global.error')} />
        </View>
      )}

      <SkeletonPlaceholder borderRadius={4} enabled={loading}>
        <View>
          <Text style={styles.price}>{product?.price}</Text>
          <Text style={styles.title}>{product?.title}</Text>
        </View>
      </SkeletonPlaceholder>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {product?.subImages?.length == 1 ? (
          <SkeletonPlaceholder borderRadius={4} enabled={loading}>
            <View style={styles.oneImageContainer}>
              <Image
                source={{uri: product?.subImages[0]}}
                style={styles.image}
              />
            </View>
          </SkeletonPlaceholder>
        ) : (
          <FlatList
            data={product?.subImages}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
            renderItem={renderImage}
            keyExtractor={index => index.toString()}
          />
        )}
        <SkeletonPlaceholder borderRadius={4} enabled={loading}>
          <View>
            <Text style={styles.description}>{product?.description}</Text>
            <View style={styles.addToCartButton}>
              <PrimaryButton text={t('productDetails.addToCart')} />
            </View>
          </View>
        </SkeletonPlaceholder>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    height: '100%',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontFamily: 'DMSansBold',
    color: '#0ACF83',
    lineHeight: 20,
    letterSpacing: 0.2,
    marginHorizontal: 24,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontFamily: 'DMSansBold',
    color: '#000000',
    lineHeight: 36,
    letterSpacing: 0.2,
    marginTop: 12,
    marginHorizontal: 24,
  },
  image: {
    height: '95%',
    aspectRatio: 0.73,
    borderRadius: 10,
    resizeMode: 'cover',
    marginTop: 12,
    marginHorizontal: 12,
  },
  imagesContainer: {
    height: 390,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  oneImageContainer: {
    height: 390,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  description: {
    paddingTop: 24,
    marginHorizontal: 24,
    fontSize: 16,
    fontFamily: 'DMSans',
    color: '#000000',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  addToCartButton: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  alertMessage: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default ProductDetails;
