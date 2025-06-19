#include<iostream>
#include<string>
#include<algorithm>

using namespace std;


bool jing(string m){
     
    bool  n;

    if (m=="有精")
    {
        n=true;
    }
    else if(m=="无精")
    {
        n=false;
    }
    
    return 0;
}
int main(){


    cout<<"庄家请输入1"<<"    "<<"闲家请输入2"<<"\n"; 

    int n;
    while (cin>>n)
    {
        if (n==1)
        {
            cout<<"自摸请输入1"<<"    "<<"闲家放炮请输入2"<<"\n";//判断庄家还是闲家；
            int n;
            while (cin>>n)
            {
                string input;
                if (n==1)     //是庄家
                {
                    string hufainput;
                    if (hufa(hufainput)==1)  //庄家自摸
                    {
                        if(jing(input))//有精
                        {
                            string paixinginput;
                            while (cin>>paixinginput)//输出庄家自摸有精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<4;
                               }
                               else if (paixinginput=="精吊")
                               {
                                cout<<8;
                               }
                               else if (paixinginput=="杠开")
                               {
                                cout<<8;
                               }
                               else if (paixinginput=="7对")
                               {
                                cout<<8;
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<8;
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<16;
                               }
                              
                            }                      
                        }
                        else //没精
                        {
                            string paixinginput;
                             while (cin>>paixinginput)//输出庄家自摸无精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<13;
                               }
                               else if (paixinginput=="杠开")
                               {
                                cout<<21;
                               }
                               else if (paixinginput=="7对")
                               {
                                cout<<21;
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<21;
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<37;
                               }
                            }  
                        }                   
                    }
                    else if(hufa(hufainput)==2)//闲家放炮
                    {
                         if(jing(input))       //有精
                         {        
                             string paixinginput;
                             while (cin>>paixinginput)//输出闲家放炮有精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"放炮4个，闲家2个";
                               }                            
                               else if (paixinginput=="7对")
                               {
                                cout<<"放炮8个，闲家4个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"放炮8个，闲家4个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"放炮16个，闲家8个";
                               }
                            }
                         }

                         if(!jing(input))       //无精
                         {        
                             string paixinginput;
                             while (cin>>paixinginput)//输出闲家放炮无精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"放炮13个，闲家4个";
                               }                            
                               else if (paixinginput=="7对")
                               {
                                cout<<"放炮21个，闲家8个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"放21个，闲家8个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"放炮37个，闲家16个";
                               }
                            }
                         }
                    }
                    
                }
                else if (n==2)//是闲家
                {
                    string hufainput;
                    if (hufa(hufainput)==1)  //自摸
                    {
                        if(jing(input))//有精
                        {
                            string paixinginput;
                            while (cin>>paixinginput)//输出闲家自摸有精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"庄家4个，闲家2个";
                               }
                               else if (paixinginput=="精吊")
                               {
                                cout<<"庄家8个，闲家4个";
                               }
                               else if (paixinginput=="杠开")
                               {
                                cout<<"庄家8个，闲家4个";
                               }
                               else if (paixinginput=="7对")
                               {
                                cout<<"庄家8个，闲家4个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"庄家8个，闲家4个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"庄家16个，闲家8个";
                               }


                               
                            }                      
                        }
                        else //没精
                        {
                            string paixinginput;
                             while (cin>>paixinginput)//输出闲家自摸无精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"庄家13个，闲家9个";
                               }
                               else if (paixinginput=="杠开")
                               {
                                cout<<"庄家21个，闲家13个";
                               }
                               else if (paixinginput=="7对")
                               {
                                cout<<"庄家21个，闲家13个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"庄家21个，闲家13个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"庄家37个，闲家21个";
                               }
                            }  
                        }                   
                    }
                    else if(!hufa(hufainput)==2)//闲家放炮
                    {
                         if(jing(input))       //有精
                         {        
                             string paixinginput;
                             while (cin>>paixinginput)//输出闲家放炮有精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"庄家2个，放炮2个，闲家1个";
                               }                            
                               else if (paixinginput=="7对")
                               {
                                cout<<"庄家4个，放炮4个，闲家2个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"庄家4个，放炮4个，闲家2个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"庄家8个，放炮8个，闲家4个";
                               }
                            }
                         }

                         if(!jing(input))       //无精
                         {        
                             string paixinginput;
                             while (cin>>paixinginput)//输出闲家放炮无精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"庄家4个，放炮9个，闲家2个";
                               }                            
                               else if (paixinginput=="7对")
                               {
                                cout<<"庄家8个，放炮13个，闲家4个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"庄家8个，放炮13个，闲家4个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"庄家16个，放炮21个，闲家8个";
                               }
                            }
                         }
                    }
                    else if(!hufa(hufainput)==3)//庄家放炮
                    {
                         if(jing(input))       //有精
                         {        
                             string paixinginput;
                             while (cin>>paixinginput)//输出庄家放炮有精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"庄家4个，闲家1个";
                               }                            
                               else if (paixinginput=="7对")
                               {
                                cout<<"庄家8个，闲家2个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"庄家8个，闲家2个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"庄家16个，闲家4个";
                               }
                            }
                         }

                         if(!jing(input))       //无精
                         {        
                             string paixinginput;
                             while (cin>>paixinginput)//输出庄家放炮无精
                            {
                               if (paixinginput=="平胡")
                               {
                                cout<<"庄家13个，闲家2个";
                               }                            
                               else if (paixinginput=="7对")
                               {
                                cout<<"庄家21个，闲家4个";
                               }
                                else if (paixinginput=="十三烂")
                               {
                                cout<<"庄家21个，闲家4个";
                               }
                               else if (paixinginput=="七星十三烂")
                               {
                                cout<<"庄家37个，闲家个";
                               }
                            }
                         }
                    }
                }
                                
            }
            
        }
        
    }
      
    return 0;
}



bool hufa(string n){

     int l;
      
    if (n=="自摸")
    {
        l=1;
    }
    else if (n=="闲家放炮")
    {
        l=2;
    }
    else if (n=="庄家放炮")
    {
        l=3;
    }
    
    return 0;

}
