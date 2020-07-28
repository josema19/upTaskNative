import React from 'react';
import { StyleSheet } from 'react-native';
import {
    Container,
    Button,
    Text,
    H2,
    Content,
    List,
    ListItem,
    Left,
    Right
} from 'native-base';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const Proyectos = () => {
    // Definir Navegación
    const navigation = useNavigation();

    // Usar Apollo
    const { data, loading, error } = useQuery(OBTENER_PROYECTOS);

    // Renderizar
    return (
        <Container style={[globalStyles.contenedor,  {backgroundColor: '#e84347' }]}>
            <Button
                style={[globalStyles.boton, { marginTop: 30 }]}
                square
                block
                onPress={() => navigation.navigate('NuevoProyecto')}
            >
                <Text style={globalStyles.botonTexto}>Nuevo Proyecto</Text>
            </Button>
            <H2 style={globalStyles.subtitulo}>Selecciona un Proyecto</H2>
            <Content>
                <List style={styles.contenido}>
                    {!loading && data.obtenerProyectos.map(proyecto => (
                        <ListItem
                            key={proyecto.id}
                            onPress={() => navigation.navigate('Proyecto', proyecto)}
                        >
                            <Left>
                                <Text>{proyecto.nombre}</Text>
                            </Left>
                            <Right>

                            </Right>
                        </ListItem>
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
    },
});
 
export default Proyectos;