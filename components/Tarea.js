import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
    Text,
    ListItem,
    Left,
    Right,
    Icon,
    Toast,
} from 'native-base';
import { gql, useMutation } from '@apollo/client';

const ACTUALZIAR_TAREA = gql`
    mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean) {
        actualizarTarea(id: $id, input: $input, estado: $estado) {
            id
            nombre
            proyecto
            estado
        }
    }
`;

const ELIMINAR_TAREA = gql`
    mutation eliminarTarea($id: ID!) {
        eliminarTarea(id: $id)
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

const Tarea = ({tarea, proyectoId}) => {
    // Obtener id tarea
    const { id } = tarea

    // Apollo
    const [ actualizarTarea ] = useMutation(ACTUALZIAR_TAREA);
    const [ eliminarTarea ] = useMutation(ELIMINAR_TAREA, {
        update(cache) {
            const { obtenerTareas } = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyectoId
                    }
                }
            });
            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyectoId
                    }
                },
                data: {
                    obtenerTareas: obtenerTareas.filter(tareaActual => tareaActual.id !== tarea.id )
                }
            });
        }
    });

    // Cambiar estado de tarea
    const cambiarEstado = async () => {
        try {
            const { data } = await actualizarTarea({
                variables: {
                    id,
                    input: {
                        nombre: tarea.nombre
                    },
                    estado: !tarea.estado                    
                }
            });
        } catch (error) {
           console.log(error); 
        };
    };

    // Diálogo para eliminar
    const mostrarEliminar = () => {
        Alert.alert(
            'Eliminar Tarea',
            'Deseas eliminar esta tarea?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: () => eliminarTareaDB()
                }
            ]
        )
    };

    // Eliminar Tarea
    const eliminarTareaDB = async () => {
        try {
            const { data } = await eliminarTarea({
                variables: {
                    id
                }
            });
        } catch (error) {
            console.log(error);
            
        };
    };

    // Renderizar
    return (
        <>
            <ListItem
                onPress={() => cambiarEstado()}
                onLongPress={() => mostrarEliminar()}
            >
                <Left>
                    <Text>{tarea.nombre}</Text>
                </Left>
                <Right>
                    {tarea.estado ? (
                        <Icon
                            style={[styles.icono, styles.completo]}
                            name="ios-checkmark-circle"
                        />
                    ) : (
                        <Icon 
                            style={[styles.icono, styles.incompleto]}
                            name="ios-checkmark-circle"
                        />
                    )}
                </Right>
            </ListItem>
        </>
    );
}

const styles = StyleSheet.create({
    icono: {
        fontSize: 32,
    },
    completo: {
        color: 'green',
    },
    incompleto: {
        color: '#e1e1e1',
    }
})
 
export default Tarea;