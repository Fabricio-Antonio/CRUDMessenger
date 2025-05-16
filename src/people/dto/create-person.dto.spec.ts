import { validate } from 'class-validator';
import { CreatePersonDto } from './create-person.dto';

describe('CreatePersonDto', () => {
  it('should validate the DTO', async () => {
    const dto = new CreatePersonDto();
    dto.name = 'Fabricio';
    dto.email = 'fabricio@email.com';
    dto.password = '@Bc123456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
  it('should fail validation with invalid email', async () => {
    const dto = new CreatePersonDto();
    dto.name = 'Fabricio';
    dto.email = 'invalid-email';
    dto.password = '@Bc123456';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with short password', async () => {
    const dto = new CreatePersonDto();
    dto.name = 'Fabricio';
    dto.email = 'fabricio@email.com';
    dto.password = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation with missing name', async () => {
    const dto = new CreatePersonDto();
    dto.name = '';
    dto.email = 'fabricio@email.com';
    dto.password = '@Bc123456';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });
});
