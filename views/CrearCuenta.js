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

const CREAR_CUENTA = gql`
    mutation crearUsuario($input: UsuarioInput) {
        crearUsuario(input: $input)
    }
`;

const CrearCuenta = () => {
    // Iniciar estados
    const [ nombre, guardarNombre ] = useState('');
    const [ email, guardarEmail ] = useState('');
    const [ password, guardarPassword ] = useState('');
    const [ mensaje, guardarMensaje ] = useState(null);

    // Definir Navegación
    const navigation = useNavigation();

    // Definir mutacion de apollo
    const [ crearUsuario ] = useMutation(CREAR_CUENTA);

    // Función para manejar el Submit
    const handleSubmit = async () => {
        // Validar Usuario
        if ((nombre.trim() === '') || (email.trim() === '') || (password.trim() === '')) {
            guardarMensaje('Todos los campos son obligatorios');
            return;
        };

        // Validar Password de al menos 6 caractéres
        if (password.trim().length < 6) {
            guardarMensaje('El password debe ser de al menos 6 caracteres');
            return;
        };

        // Guardar en la BD
        try {
            const { data } = await crearUsuario({
                variables: {
                    input: {
                        nombre,
                        email,
                        password
                    }
                }
            });
            // Mostrar mensaje de éxito
            guardarMensaje(data.crearUsuario);

            // Redireccionar
            navigation.navigate('Login');
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
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={texto => guardarNombre(texto)}
                        />
                    </Item>
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
                        <Text style={globalStyles.botonTexto}>Crear Cuenta</Text>
                    </Button>
                    {mensaje && mostrarAlerta()}
                </Form>
            </View>
        </Container>
    );
}
 
export default CrearCuenta;