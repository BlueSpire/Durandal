import app = module('app');

interface DurandallApp
{
    showMessage(param1: string, param2:string, param3: string[]) ;
    showMessage(param1: string, param2:string) ;
}

declare module 'app'
{
}