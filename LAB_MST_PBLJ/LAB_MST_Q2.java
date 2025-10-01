package intro_day1;
import java.util.*;

class employeenotfoundexception extends Exception{
	public employeenotfoundexception(String msg) {
		super(msg);
	}
}
public class labmstq2{
	Map<Integer,String> mp=new HashMap<>();
	
	public void addemployee(int id,String st) {
		mp.put(id,st);
	}
	public String retreive(int id) throws employeenotfoundexception{
		if(!mp.containsKey(id)) {
			throw new employeenotfoundexception("Employee with id= "+id+"not found");
		}
		return mp.get(id);
	}
	public static void main(String args[]) {
		Scanner sc=new Scanner(System.in);
		labmstq2 ob=new labmstq2();
		 ob.addemployee(101, "Mandeep");
	     ob.addemployee(102, "Karan");
	     ob.addemployee(103, "Simran");

	    System.out.print("Enter Employee ID to search: ");
		int id=sc.nextInt();

	        try {
	            String name = ob.retreive(id);
	            System.out.println("Employee Found: " + name);
	        } catch (employeenotfoundexception e) {
	            System.out.println("Error: " + e.getMessage());
	        }
	    }
		
		
	}
