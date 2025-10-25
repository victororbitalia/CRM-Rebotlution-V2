# Deployment Error Fix Plan

## Problem Analysis
The deployment is failing due to a TypeScript error in `app/settings/tables-map/page.tsx:57`. The error message indicates:

```
Type error: Argument of type '(table: Table) => { status: string; reservationId: string | undefined; id: string; number: number; capacity: number; location: "interior" | "terraza" | "exterior" | "privado"; isAvailable: boolean; ... 5 more ...; updatedAt: Date; }' is not assignable to parameter of type '(value: Table, index: number, array: Table[]) => { status: string; reservationId: string | undefined; id: string; number: number; capacity: number; location: "interior" | "exterior" | "terraza" | "privado"; ... 6 more ...; updatedAt: Date; }'.
Types of parameters 'table' and 'value' are incompatible.
Type 'Table' is missing the following properties from type 'Table': shape, status, createdAt, updatedAt
```

## Root Cause
There are two different Table interfaces in the codebase:
1. `types/index.ts` - Basic Table interface with only essential properties
2. `types/map.ts` - Complete Table interface with all properties including shape, status, createdAt, updatedAt

The API returns tables with all properties (matching the complete interface in types/map.ts), but there's a type mismatch between the different Table interfaces being used across the application.

## Solution Steps

### 1. Remove the duplicate Table interface from types/index.ts
- Remove the Table interface definition from types/index.ts
- Export the Table interface from types/map.ts instead

### 2. Update imports in affected files
- Update `context/RestaurantContext.tsx` to import Table from types/map.ts
- Update `lib/mockData.ts` to import Table from types/map.ts
- Update `app/tables/page.tsx` to import Table from types/map.ts

### 3. Update mockData.ts to match the complete Table interface
- Add missing properties (shape, status, position, size, createdAt, updatedAt) to mock tables

### 4. Test the fix
- Run `npm run build` locally to verify the TypeScript error is resolved
- Test the application to ensure all functionality works correctly

## Files to Modify

1. `types/index.ts`
   - Remove the Table interface definition
   - Add export: `export { Table, Reservation, DashboardStats } from './map'`

2. `context/RestaurantContext.tsx`
   - Change import from `import { Reservation, Table } from '@/types';` to `import { Reservation } from '@/types'; import { Table } from '@/types/map';`

3. `lib/mockData.ts`
   - Change import from `import { Reservation, Table } from '@/types';` to `import { Reservation } from '@/types'; import { Table } from '@/types/map';`
   - Update mockTables to include all required properties

4. `app/tables/page.tsx`
   - Change import from `import { Table } from '@/types';` to `import { Table } from '@/types/map';`

## Expected Outcome
After implementing these changes:
1. The TypeScript error will be resolved
2. The application will build successfully
3. All components will use the same complete Table interface
4. The deployment will succeed

## Testing
1. Run `npm run build` to verify no TypeScript errors
2. Run the application locally to ensure all functionality works
3. Test the tables map page specifically to ensure it works correctly
4. Deploy the application to verify the fix resolves the deployment issue