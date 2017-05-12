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

//version recherche sous colonne predefinies
/* @Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
  transform(categories: any, searchText: any): any {
	  
	  
    if(searchText == null) return categories;

    return categories.filter(function(category){
      return category.spaceRef.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  } 
}*/

//version filtrage selon colonne envoyée en args
@Pipe({ name: 'category' })
export class CategoryPipe implements PipeTransform {
  transform(categories: any, args?: any): any {
	  
	  
    if(args.search == null) return categories;

    return categories.filter(function(category){
		switch(args.categorie)
		{
			case "Reference" :
				return category.reference.toLowerCase().indexOf(args.search.toLowerCase()) > -1;
				
			case "Espace" :
			    return category.spaceRef.toLowerCase().indexOf(args.search.toLowerCase()) > -1;

			
		}
    })
  }
}


