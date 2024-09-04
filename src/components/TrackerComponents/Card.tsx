
const Card = ({ title }: { title: string }) => {
    return <div>
      <div
      className="overflow-hidden rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg sm:p-6 hover:scale-[1.02] transition-transform duration-300 ease-in-out"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
           <div className="text-ac-gold">
            {title}
            </div>
          <div className="px-4 py-5 sm:p-6">Content will go here


          </div>
          </div>

        </div>
        
      
    }


export default Card