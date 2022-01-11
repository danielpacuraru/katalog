import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserID = createParamDecorator((data, ctx): string => {
  const request = ctx.switchToHttp().getRequest();
  console.log(data);
  console.log(request.user);
  return request.user;
});
