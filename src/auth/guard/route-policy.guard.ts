// @Injectable()
// export class RoutePolicyGuard implements CanActivate {
//   constructor() {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
//       ROUTE_POLICY_KEY,
//       context.getHandler(),
//     )
//     console.log(routePolicyRequired)
//     return true;
//   }
// }
