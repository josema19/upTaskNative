import React, { useState } from 'react';
import { View } from 'react-native';
import {
    Container,
    Button,
    Text,
    H1,
    Input,
    Form,
    Item,
    Toast
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/global';
import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`;

const Login = () => {
    // Iniciar estados
    const [ email, guardarEmail ] = useState('');
    const [ password, guardarPassword ] = useState('');
    const [ mensaje, guardarMensaje ] = useState(null);

    // Definir Navegación
    const navigation = useNavigation();

    // Definir mutacion de apollo
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    // Función para iniciar sesión
    const handleSubmit = async () => {
        // Validar Usuario
        if ((email.trim() === '') || (password.trim() === '')) {
            guardarMensaje('Todos los campos son obligatorios');
            return;
        };

        // Consultar BD
        try {
            const { data } = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            });

            // Obtener token de autenticación
            const { token } = data.autenticarUsuario;

            // Almacenar token en Storage
            await AsyncStorage.setItem('token', token);

            // Redireccionar
            navigation.navigate('Proyectos');

        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''));            
        };
    };

    // Función para mostrar una alerta
    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'OK',
            duration: 5000
        });
    };

    // Renderizar Componente
    return (
        <Container style={[globalStyles.contenedor, { backgroundColor: '#e84347' }]}>
            <View style={globalStyles.contenido}>
                <H1 style={globalStyles.titulo}>UpTask</H1>
                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            autoCompleteType="email"
                            placeholder="Email"
                            value={email}
                            onChangeText={texto => guardarEmail(texto)}
                        />
                    </Item>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            secureTextEntry={true}
                            placeholder="Password"
                            value={password}
                            onChangeText={texto => guardarPassword(texto)}
                        />
                    </Item>
                    <Button
                        square
                        block
                        style={globalStyles.boton}
                        onPress={() => handleSubmit()}
                    >
                        <Text style={globalStyles.botonTexto}>Iniciar Sesión</Text>
                    </Button>
                    <Text 
                        style={globalStyles.enlace}
                        onPress={() => navigation.navigate('CrearCuenta')}
                    >Crear Cuenta</Text>
                    {mensaje && mostrarAlerta()}
                </Form>
            </View>
        </Container>
    );
}
 
export default Login;