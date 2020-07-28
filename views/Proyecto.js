import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
    Container,
    Button,
    Text,
    H2,
    Content,
    List,
    Form,
    Item,
    Input,
    Toast
} from 'native-base';
import globalStyles from '../styles/global'
import { gql, useMutation, useQuery } from '@apollo/client';
import Tarea from '../components/Tarea';

const NUEVA_TAREA = gql`
    mutation nuevaTarea($input: TareaInput) {
        nuevaTarea(input: $input) {
            id
            nombre
            proyecto
            estado
        }
    }
`;

const OBTENER_TAREAS = gql`
    query obtenerTareas($input: ProyectoIDInput) {
        obtenerTareas(input: $input) {
            id
            nombre
            estado
        }
    }
`;

const Proyecto = ({route}) => {
    // Obtener id de proyecto
    const { id } = route.params;

    // Definir State
    const [ nombre, guardarNombre ] = useState('');
    const [ mensaje, guardarMensaje ] = useState(null);

    // Apollo
    const [ nuevaTarea ] = useMutation(NUEVA_TAREA, {
        update(cache, { data: { nuevaTarea }}) {
            const { obtenerTareas } = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: id
                    }
                }
            });
            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: id
                    }
                },
                data: {
                    obtenerTareas: [...obtenerTareas, nuevaTarea]
                }
            })
        }
    });
    const { data, loading, error } = useQuery(OBTENER_TAREAS, {
        variables: {
            input: {
                proyecto: id
            }
        }
    });

    // Generar Tarea
    const handleSubmit = async () => {
        // Validar Nombre
        if (nombre.trim() === '') {
            guardarMensaje('El nombre de la tarea es obligatorio');
            return;
        };

        // Almacenar en la BD
        try {
            const { data } = await nuevaTarea({
                variables: {
                    input: {
                        nombre,
                        proyecto: id
                    }
                } 
            });
            guardarNombre('');
            guardarMensaje('Tarea creada correctamente');
            setTimeout(() => {
                guardarMensaje(null);
            }, 3000);
        } catch (error) {
            console.log(error);            
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

    if (loading) return <Text>Cargando...</Text>

    // Renderizar
    return (
        <Container style={[globalStyles.contenedor, { backgroundColor: '#e84347' }]}>
            <Form style={{ marginHorizontal: '2.5%', marginTop: 20 }}>
                <Item inlineLabel last style={globalStyles.input}>
                    <Input 
                        placeholder='Nombre Tarea'
                        value={nombre}
                        onChangeText={texto => guardarNombre(texto)}
                    />
                </Item>
                <Button
                    style={globalStyles.boton}
                    square
                    block
                    onPress={() => handleSubmit()}
                >
                    <Text style={globalStyles.botonTexto}>Crear Tarea</Text>
                </Button>
                {mensaje && mostrarAlerta()}
            </Form>
            <H2 style={globalStyles.subtitulo}>Tareas: {route.params.nombre}</H2>
            <Content>
                <List style={styles.contenido}>
                    { !loading && data.obtenerTareas.map(tarea => (
                        <Tarea 
                            key={tarea.id}
                            tarea={tarea}
                            proyectoId={id}
                        />
                    ))}

                </List>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#fff',
        marginHorizontal: '2.5%'
    }

});
 
export default Proyecto;