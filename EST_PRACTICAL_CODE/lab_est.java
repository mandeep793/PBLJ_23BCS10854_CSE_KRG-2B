package intro_day1;
class PrintNumber{
	
	int n=1;
	int limit=15;
	synchronized void oddprint() {
	 while(n<=limit) {
		while(n%2==0) {
			try { wait();} catch(Exception e) {}
		}
		System.out.println("Odd number: "+n);
		n++;
		notify();
	}
	}
    synchronized void evenprint() {
		 while(n<limit) {
			while(n%2!=0) {
				try { wait();} catch(Exception e) {}
			}
			System.out.println("Even number: "+n);
			n++;
			notify();
		}
	}
}

class Oddthread extends Thread{
	PrintNumber p;
	Oddthread(PrintNumber p){
		this.p=p;
	}
	public void run() {
		p.oddprint();
	}
}

class evenThread extends Thread{
	PrintNumber p;
	evenThread(PrintNumber p){
		this.p=p;
	}
	public void run() {
		p.evenprint();
	}
}
public class lab_est {
    public static void main(String[] args) {
        PrintNumber p=new PrintNumber();
        
        Oddthread t1=new Oddthread(p);
        evenThread t2=new evenThread(p);
        
        t1.start();
        t2.start();
    }
}
