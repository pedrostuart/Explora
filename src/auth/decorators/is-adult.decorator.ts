import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAdult(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isAdult',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value) return false;

                    const dataNascimento = new Date(value);
                    const hoje = new Date();

                    // Impede datas futuras
                    if (dataNascimento > hoje) return false;

                    // Calcula a idade exata com base no ano, mês e dia
                    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
                    const diferencaMeses = hoje.getMonth() - dataNascimento.getMonth();

                    if (diferencaMeses < 0 || (diferencaMeses === 0 && hoje.getDate() < dataNascimento.getDate())) {
                        idade--;
                    }

                    return idade >= 18;
                },
            },
        });
    };
}
