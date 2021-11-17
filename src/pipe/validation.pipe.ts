import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(option?: ValidatorOptions) {
    this.option = option;
  }
  private option: ValidatorOptions = {};

  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    console.log(`value:`, value, 'metatype: ', metatype);
    if (!metatype || !this.toValidate(metatype)) {
      // 如果没有传入验证规则，则不验证，直接返回数据
      return value;
    }

    // 将对象转换为 Class 来验证
    const object = plainToClass(metatype, value);
    const errors = await validate(object, this.option);
    if (errors.length > 0) {
      const msg = this.getFirstErrorMessage(errors); // 只需要取第一个错误信息并返回即可
      throw new BadRequestException(`Validation failed: ${msg}`);
    }
    return object;
  }

  private getFirstErrorMessage(validationError: ValidationError[]): string {
    try {
      const constraints = validationError[0].constraints;
      if (constraints) return Object.values(constraints)[0];
      const children = validationError[0].children;
      if (children && children.length > 0) {
        return this.getFirstErrorMessage(children);
      }
    } catch (error) {
      throw new Error();
    }
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
