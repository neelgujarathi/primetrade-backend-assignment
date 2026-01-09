import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description:
        "API documentation for Backend Developer Assignment. Includes authentication, user, and task CRUD operations.",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local Server",
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
