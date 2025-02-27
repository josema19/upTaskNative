import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root } from 'native-base';

import Login from './views/Login';
import CrearCuenta from './views/CrearCuenta';
import Proyectos from './views/Proyectos';
import NuevoProyecto from './views/NuevoProyecto';
import Proyecto from './views/Proyecto';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <Root>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: "Iniciar Sesion",
                headerShown: false
              }}
            />
            <Stack.Screen
              name="CrearCuenta"
              component={CrearCuenta}
              options={{
                title: "Crear Cuenta",
                headerStyle: {
                  backgroundColor: '#28303b'
                },
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold'
                }
              }}
            />
            <Stack.Screen
              name="Proyectos"
              component={Proyectos}
              options={{
                title: "Proyectos",
                headerStyle: {
                  backgroundColor: '#28303b'
                },
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold'
                }
              }}
            />
            <Stack.Screen
              name="NuevoProyecto"
              component={NuevoProyecto}
              options={{
                title: "Nuevo Proyecto",
                headerStyle: {
                  backgroundColor: '#28303b'
                },
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold'
                }
              }}
            />
            <Stack.Screen
              name="Proyecto"
              component={Proyecto}
              options={ ({route: {params}}) => ({
                title: params.nombre,
                headerStyle: {
                  backgroundColor: '#28303b'
                },
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold'
                }
              })}
            />


          </Stack.Navigator>
        </NavigationContainer>
      </Root>
    </>
  );
};

export default App;