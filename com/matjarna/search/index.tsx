import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import IconButton from '../sharedComponents/iconButton';
import ChevronLeftIcon from '../assets/icons/chevronLeftIcon';
import ShoppingCartIcon from '../assets/icons/shoppingCartIcon';
import SearchInputField from '../sharedComponents/searchInputField';
import {searchProducts} from './api';
import {Product, productMapper} from '../products/product';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {debounce} from 'lodash';

type SearchScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const Search = ({navigation}: SearchScreenProps) => {
  const {t, i18n} = useTranslation();
  const searchInputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const countryCode = useSelector((state: any) => state.location.countryCode);
  const debounceFetchProducts = useRef(
    debounce((text: string) => fetchProducts(text), 500),
  ).current;

  useEffect(() => {
    if (searchInputRef && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (page > 0) {
      fetchProducts(inputValue);
    }
  }, [page]);

  const fetchProducts = async (text: string) => {
    if (text != '') {
      if (page == 0) {
        setData([]);
      }
      try {
        const response: any = await searchProducts(
          page,
          text,
          i18n.language,
          countryCode,
        );
        if (response.totalNumber > 0) {
          const transformedData: Product[] =
            response.results.map(productMapper);
          const filteredProducts = transformedData.filter(
            newProduct => !data.find(product => product.id === newProduct.id),
          );
          setData(prevData => [...prevData, ...filteredProducts]);
          setTotalPages(Math.ceil(response.totalNumber / 10));
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
      }
    } else {
      setData([]);
    }
  };

  const renderItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => {
        navigation.navigate('productDetails', {productId: item.id});
      }}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <View>
        <Text style={styles.productContent}>{item.title}</Text>
        <Text style={styles.productContent}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    debounceFetchProducts(text);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'dark-content'} backgroundColor="transparent" />
      <View style={styles.topBar}>
        <IconButton icon={<ChevronLeftIcon />} onPress={handleBackPress} />
        <View>
          <Text style={styles.logoName}>{t('searchBar.search')}</Text>
        </View>
        <IconButton icon={<ShoppingCartIcon />} />
      </View>
      <View style={styles.searchBar}>
        <SearchInputField
          placeholder={t('homePage.search')}
          returnKeyType="done"
          textInputRef={searchInputRef}
          value={inputValue}
          onChangeText={handleInputChange}
        />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={1}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  logo: {
    alignItems: 'center',
  },
  logoName: {
    paddingStart: 4,
    fontFamily: 'DMSansBold',
    fontSize: 19.05,
    lineHeight: 24.8,
    color: '#000000',
    letterSpacing: 0.24,
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchBar: {
    height: 70,
    paddingHorizontal: 24,
  },
  productItem: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: 'row',
  },
  image: {
    height: 75,
    width: 75,
    borderRadius: 5,
  },
  productContent: {
    paddingHorizontal: 12,
    paddingTop: 6,
    fontSize: 16,
    fontFamily: 'DMSansRegular',
    color: '#000000',
    lineHeight: 18.23,
    letterSpacing: 0.2,
  },
});

export default Search;
