import React, { useState } from 'react';
import { View } from 'react-native';
import {
    Container,
    Button,
    Text,
    H1,
    Form,
    Input,
    Toast,
    Item,
} from 'native-base';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';

const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto($input: ProyectoInput) {
        nuevoProyecto(input: $input) {
            id
            nombre
        }
    }
`;

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const NuevoProyecto = () => {
    // Iniciar estados
    const [ nombre, guardarNombre ] = useState('');
    const [ mensaje, guardarMensaje ] = useState(null);

    // Apollo
    const [ nuevoProyecto ] = useMutation(NUEVO_PROYECTO, {
        update(cache, { data: { nuevoProyecto }}) {
            const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS });
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: { obtenerProyectos: obtenerProyectos.concat([nuevoProyecto]) }
            })
        }
    });

    // Hook de navegacion
    const navigation = useNavigation();
    
    // Función para mostrar una alerta
    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'OK',
            duration: 5000
        });
    };

    // Función para el formulario
    const handleSubmit = async () => {
        // Validar campos
        if (nombre.trim() === '') {
            guardarMensaje('El nombre del proyecto es obligatorio');
            return;
        };

        // Guardar en la BD
        try {
            const { data } = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            });
            guardarMensaje('Proyecto creado correctamente');
            navigation.navigate('Proyectos');
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''));            
        };
    };

    // Renderizar
    return (
        <Container style={[globalStyles.contenedor,  {backgroundColor: '#e84347' }]}>
            <View style={globalStyles.contenido}>
                <H1 style={globalStyles.subtitulo}>Nuevo Proyecto</H1>
                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input 
                            placeholder="Nombre del Proyecto"
                            value={nombre}
                            onChangeText={texto => guardarNombre(texto)}
                        />
                    </Item>
                    <Button
                        style={[globalStyles.boton, { marginTop: 30 }]}
                        square
                        block
                        onPress={() => handleSubmit()}
                    >
                        <Text style={globalStyles.botonTexto}>Crear Proyecto</Text>
                    </Button>
                    {mensaje && mostrarAlerta()}
                </Form>
            </View>
        </Container>
    );
}
 
export default NuevoProyecto;