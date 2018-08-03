import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { OntimizeEEService, Util } from 'ontimize-web-ngx';

@Injectable()
export class CustomerService extends OntimizeEEService {

  constructor(protected injector: Injector) {
    super(injector);
  }

  public customerQuery(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object): Observable<any> {
    kv = kv || {};
    kv['CUSTOMERID'] = 10602;
    return super.query(kv, av, entity, sqltypes);
  }

}
