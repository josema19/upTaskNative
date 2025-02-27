import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
    },
    contenido: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '2.5%',
    },
    titulo: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitulo: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    boton: {
        backgroundColor: '#28303b',
    },
    botonTexto: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#fff',
    },
    enlace: {
        color: '#fff',
        marginTop: 60,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase'
    }
});

export default styles;