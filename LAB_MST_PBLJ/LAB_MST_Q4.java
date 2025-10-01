package intro_day1;

class t1 extends Thread{
	public  void run() {
	for(int i=1;i<=10;i++) {
		System.out.println(i);
	}
	}
}

class t2 extends Thread{
	public void run() {
	for(int i=1;i<=10;i++) {
		System.out.println(i*i);
	}
	}
}

public class labmstq4{
	public static void main(String args[]) {
		t1 thread1=new t1();
		t2 thread2=new t2();
		thread1.start();
		thread2.start();
	}
}