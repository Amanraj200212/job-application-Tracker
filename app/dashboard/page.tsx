import { getSession} from "@/lib/auth/auth";
import connectDB from "@/lib/db"
import { Board } from "@/lib/model";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/Kanban-board";


const dashBoard = async () => {
  const session = await getSession();

  if(!session?.user) {
    redirect('/sign-in');
  }

  await connectDB();

  const board = await Board.findOne({
    userId: session?.user.id,
    name: "Job Hunt",
  }).populate({ // i have know more about it
    path: "columns",
  });

  console.log(board);
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black" >Job Hunt</h1>
          <p className="text-gray-600">Track your Applications</p>
        </div>

        <KanbanBoard 
          board={JSON.parse(JSON.stringify(board))}  // here mongoose return data in doc form not in json formate
          userId={session.user.id}
        />
      </div>
    </div>
  )
}

export default dashBoard