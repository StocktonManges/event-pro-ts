# Event Pro: Simplifying Event Management for Businesses and Clients

Event Pro is a React web application designed to revolutionize event management for birthday party and event entertainment businesses while providing clients with a streamlined booking process. 

### Purpose:
I created Event Pro to address the complexities of event organization faced by businesses in the birthday party and event entertainment industry. The app simplifies the booking process for clients while offering a one-stop solution for businesses to manage their services efficiently.

### Highlight Features:
- **Real-Time Chat Feature:** Developed a real-time chat feature from scratch using socket.io, enabling seamless and interactive communication between users and businesses within the application.
- **JSON Server Integration:** Leveraged JSON Server to simulate a backend environment, enabling HTTP requests and dynamic content rendering based on server responses, facilitating realistic data interactions and content management.
- **Context API Usage:** Utilized the useContext hook to create providers, making data and functions available throughout the application, ensuring efficient state management and component communication.
- **Customized Form Validation:** Created multiple different forms within the application that undergo rigorous validation before submission, ensuring data integrity and user input accuracy, thus enhancing the overall reliability and usability of the application.
- **Session Storage Implementation:** Implemented sessionStorage to enable data persistence, enabling basic authentication and enhancing user experience by retaining essential information across sessions.
- **"My Events" Page:** Both clients and businesses have access to a dedicated "My Events" page, where they can view and manage booked events, ensuring clarity and organization throughout the process.
- **"Services" Page:** Event Pro offers a centralized platform for showcasing various businesses' services. Clients can easily explore available services, while businesses have the flexibility to filter and manage their offerings.

With Event Pro, businesses can expand their reach and streamline their operations, while clients enjoy a hassle-free booking experience, making it a valuable asset for event management in the industry.

### Key Technologies:

* TypeScript
* CSS & HTML
* JavaScript
* React
* Zod - for robust type safety
* JSON Server - a simulated backend to enable HTTP requests
* React Hot Toast - to enhance in-app notifications
* socket.io - to create websockets for a real-time chat experience
* React Router Dom - for enhanced navigation

## Running Event Pro locally:

1. Open three terminals.

2. Run the following commands in terminal 1 to run the React app:

```
npm i
npm run dev
```

3. In terminal 2, run the following command to get the JSON server up and running:

```
npm run serve
```

4. To run the chat feature, run the following commands in the third terminal:

> Note: By opening multiple web browser tabs, users can log in to different accounts simultaneously and view the real-time chat feature in action.

```
cd socket.io-server
npm run serve:socket
```

### Reseeding the database:

Open a new terminal and run:

```
npm run seed
```
