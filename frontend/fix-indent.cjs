const fs = require('fs');
const root = 'C:/Users/BHARATH M N/OneDrive/Desktop/Train_ticket/frontend/src';

let f = root + '/components/search/SearchForm.tsx';
let s = fs.readFileSync(f, 'utf8');
s = s.replace(
  /^( *)resolver: zodResolver\(searchSchema\) as Resolver<SearchFormData>,$/m,
  '    resolver: zodResolver(searchSchema) as Resolver<SearchFormData>,',
);
fs.writeFileSync(f, s);

f = root + '/pages/BookingPage.tsx';
s = fs.readFileSync(f, 'utf8');
s = s.replace(
  /^( *)resolver: zodResolver\(passengerSchema\) as Resolver<PassengerFormData>,$/m,
  '    resolver: zodResolver(passengerSchema) as Resolver<PassengerFormData>,',
);
fs.writeFileSync(f, s);

f = root + '/pages/PaymentPage.tsx';
s = fs.readFileSync(f, 'utf8');
s = s.replace(/^( *)return current;$/m, '      return current;');
fs.writeFileSync(f, s);

console.log('indentation fixed');
