<h1 style="text-align: center;">Red De Egresados</h1>

<div style="text-align: center; align-content: center;">

![Logo del IPM](/src/assets/images/logo_ipm.png)

</div>

##

## A tener en cuenta

- Se necesita establecer sus propias variables de firebase en environment

1.  ![pagina de firebase](/src/assets/images/firebase.png)
2.  ![firebase key](/src/assets/images/api_keys_firebase.png)

Los datos que interesan de ahi son los siguientes:
![firebase key de cerca](/src/assets/images/api_keys_firebase_closeup.png)

Estos datos se pegan en 'src/environments/environment.ts'
![firebase key in environment](/src/assets/images/api_keys_firebase_in_environment.png)

###

- Se necesita establecer sus propias keys para emailJS en 'email-contact'.

  ###

  - Service ID
    ![service_ID](/src/assets/images/emailJS_service_ID.png)
    ![service_ID](/src/assets/images/emailJS_service_ID_closeup.png)
    ###
  - template ID
    ![template_ID](/src/assets/images/emailJS_template_ID.png)
    ![template_ID](/src/assets/images/emailJS_template_ID_closeup.png)
    ###
  - user ID
    ![user_ID](/src/assets/images/emailJS_user_ID.png)
    ![user_ID](/src/assets/images/emailJS_user_ID_closeup.png)

  ###

  Todas estas variables se pegan en 'src/app/auth/egresado/email-contact/email-contact.component.ts'
  ![emailJs keys in email-contact](/src/assets/images/emailJS_keys.png)

  ###

- Estos datos son los que tienen que estar en comun entre la plantilla de emailJS y el html que se usa para enviar el mensaje
  ###
  - plantilla de email y html
    ![plantilla emailJS](/src/assets/images/plantilla_emailJS.png)
    ![plantilla emailJS](/src/assets/images/plantilla_emailJS_closeup.png)
    ###
    Los datos que se enceuentran entre **{}** en el html se encuetran en name
    ![plantilla html](/src/assets/images/html_emailJS.png)

###

- Se necesitan estas collections en firestore

![collections](/src/assets/images/collections_necesarias.png)

## Para desarrollo personal

Una vez descargue el proyecto y haya establecido sus propias api keys, realice los siguientes pasos:

- npm i (esto sirve para instalar dependencias)
- ng serve (para crear un servidor local)
- Vaya a [localhost](http://localhost:4200/). Cada cambio en el codigo recargara la pagina.

## Live Demo

[red-egresados-online.web.app/](http://red-egresados-online.web.app/)

## Descripción

Un usuario es capaz de registrarse siendo una empresa o un egresado.

Si es un egresado debe autenticarse poniendo su titulo de egreso y su DNI durante el registro. Si se es una empresa, un administrador verificara la veracidad de este perfil.

Una vez registrados, ambos tipos de usuario van a poder buscar a otros usuarios y contactarse entre ellos. Los egresados ademas podran agregar distintas capacitaciones y experiencias que tuvieron.

### Tareas

- [x] Login, Register & Logout
- [x] CRUD de usuarios
- [x] Integracion con diseño
- [x] Ver perfil de otro usuario
- [x] Contacto entre egresados
- [x] Busqueda de egresados
- [x] Agregar Experiencias
- [ ] Redes Sociales
- [ ] Administrador
