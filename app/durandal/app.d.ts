import app = module('app');

interface durandalApp
{ 
}

declare module 'app'
{
    export function (): durandalApp;
}