"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Cinema API')
        .setDescription('Films, halls, showings and seat bookings. Data is kept in memory and lost on restart. Prices are integers in kopiykas (12500 = 125 UAH).')
        .setVersion('1.0')
        .build();
    swagger_1.SwaggerModule.setup('docs', app, swagger_1.SwaggerModule.createDocument(app, swaggerConfig));
    const port = Number(app.get(config_1.ConfigService).get('PORT') ?? 3000);
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map