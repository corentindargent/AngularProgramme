import { Pipe,PipeTransform } from '@angular/core';
/*                         
@Pipe({
  name: "orderBy"
})
export class OrderByPipe {
  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
} */



@Pipe({  name: 'orderBy' })
export class OrderByPipe implements PipeTransform {

  transform(records: Array<any>, args?: any): any {
    
    return records.sort(function(a, b){
          if(a[args.property] < b[args.property]){
            return -1 * args.direction;
          }
          else if( a[args.property] > b[args.property]){
            return 1 * args.direction;
          }
          else{
            return 0;
          }
        });
    };
}


@Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
  transform(categories: any, searchText: any): any {
	  
	  
    if(searchText == null) return categories;

    return categories.filter(function(category){
      return category.spaceRef.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }
}


