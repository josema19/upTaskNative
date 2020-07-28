import { ApolloClient, A } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import AsyncStorage from '@react-native-community/async-storage'

// Definir url
const httpLink = createHttpLink({
    uri: 'https://intense-bayou-58095.herokuapp.com/'
});

// Definir Header
const authLink = setContext( async (_, {headers}) => {
    // Leer Token
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;